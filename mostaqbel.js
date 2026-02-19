// --- [QUP-v2: Sink Engine / الحقن المغناطيسي] ---
const QUP_Sink = {
    buffer: null,
    lastSid: null,
    totalSize: 0,

    processPulse(data) {
        if (!data) return;

        // 1. بروتوكول التزامن الأول (SYNC)
        if (data.t === 'SYNC' && data.sid !== this.lastSid) {
            this.lastSid = data.sid;
            this.totalSize = data.size;
            this.buffer = new Uint8Array(this.totalSize);
            
            // "عطالة الصندوق الأسود": ملء الذاكرة بالتوقعات الأولية فوراً
            // المتصفح لا يترجم، المتصفح "يبني الأصل" في الخلفية
            for (let i = 0; i < this.totalSize; i++) {
                this.buffer[i] = QUP_Source.getAtomicByte(i, data.seed);
            }
            console.log("غلبا: تم حقن العطالة الأولية في الذاكرة.");
            return;
        }

        // 2. بروتوكول الحقن المغناطيسي (DATA)
        if (data.t === 'DATA' && this.buffer) {
            const symbols = data.d.split(';');
            symbols.forEach(symbol => {
                if (!symbol) return;
                const [meta, valChar] = symbol.split(',');
                if (meta.startsWith("B")) {
                    const index = parseInt(meta.substring(1), 36); // استعادة الإحداثي
                    const value = valChar.charCodeAt(0) - 0x4E00; // استعادة القيمة
                    
                    // Direct Memory Injection (الحقن المباشر)
                    this.buffer[index] = value;
                }
            });

            // تحديث الواجهة (النبض)
            if (window.updateProgressPulse) window.updateProgressPulse(1); // مؤشر وهمي للالتحام
        }

        // 3. التجسيد المادي النهائي
        // يتم التحقق من اكتمال النبضات (يمكن إضافة checksum هنا)
    }
};

// ربط فيرباس بالمستقبل
window.processIncomingPulse = (data) => QUP_Sink.processPulse(data);
