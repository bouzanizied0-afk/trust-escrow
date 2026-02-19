// --- [QUP-v3: المستقبل الذكي - SINK ENGINE] ---
const QUP_Sink = {
    buffer: null,
    lastSid: null,
    totalSize: 0,
    fileName: "",

    // معادلة التوليد الذرية (يجب أن تطابق المحرك تماماً)
    getAtomicByte(tick, seed) {
        return Math.floor(((Math.sin(tick * 0.05 + seed) + Math.cos(tick * 0.02)) / 2 + 1) * 127.5);
    },

    processPulse(data) {
        if (!data) return;

        // --- [ الجزء المضاف: نظام استقبال الرسائل واختبار الترابط ] ---
        if (data.t === 'CHAT') {
            if (window.logToChat) window.logToChat("📥 استلم المستقبل: " + data.msg);
            
            // تحريك العداد الدوري (1-10) كدليل مرئي على الاستلام
            let counterElement = document.getElementById('rotaryCounter');
            if (counterElement) {
                let currentTick = parseInt(counterElement.innerText) || 0;
                let nextTick = (currentTick % 10) + 1;
                if (window.updateRotaryVisual) window.updateRotaryVisual(nextTick);
            }
            return; // إنهاء المعالجة لأنها رسالة نصية وليست بيانات ملف
        }

        // 1. استقبال بروتوكول المزامنة (SYNC)
        if (data.t === 'SYNC' && data.sid !== this.lastSid) {
            this.lastSid = data.sid;
            this.totalSize = data.size;
            this.fileName = data.name;
            this.buffer = new Uint8Array(this.totalSize);
            
            // بناء "طبقة الشبح" الأولية
            for (let i = 0; i < this.totalSize; i++) {
                this.buffer[i] = this.getAtomicByte(i, data.seed);
            }
            if (window.logToChat) window.logToChat(`📡 بدأت المزامنة: ${this.fileName} (${this.totalSize} bytes)`);
            return; 
        }

        // 2. استقبال بروتوكول الحقن (DATA)
        if (data.t === 'DATA' && this.buffer) {
            const symbols = data.d.split(';');
            symbols.forEach(symbol => {
                if (!symbol || !symbol.includes(',')) return;
                const [meta, valChar] = symbol.split(',');
                
                if (meta.startsWith("B")) {
                    const index = parseInt(meta.substring(1), 36); // فك إحداثي المكان
                    const value = valChar.charCodeAt(0) - 0x4E00; // فك القيمة الرقمية
                    
                    if (index < this.buffer.length) {
                        this.buffer[index] = value; // الحقن المباشر في الذاكرة
                    }
                }
            });

            // تحديث الواجهة عند كل حقن ناجح
            this.renderMedia();
            
            // تحريك العداد الدوري عشوائياً أثناء حقن البيانات لإظهار النشاط
            if (window.updateRotaryVisual) {
                window.updateRotaryVisual(Math.floor(Math.random() * 10) + 1);
            }
        }
    },

    // دالة التجسيد المادي للملف المستلم
    renderMedia() {
        if (!this.buffer || !this.fileName) return;

        const isVideo = this.fileName.toLowerCase().match(/\.(mp4|webm|mov)$/);
        const blob = new Blob([this.buffer], { type: isVideo ? 'video/mp4' : 'image/png' });
        const url = URL.createObjectURL(blob);
        
        const imgDisplay = document.getElementById('displayScreen');
        const videoDisplay = document.getElementById('videoScreen');
        const placeholder = document.getElementById('placeholderText');

        if (placeholder) placeholder.style.display = 'none';

        if (isVideo && videoDisplay) {
            if (imgDisplay) imgDisplay.style.display = 'none';
            videoDisplay.style.display = 'block';
            if (videoDisplay.src !== url) videoDisplay.src = url;
        } else if (imgDisplay) {
            if (videoDisplay) videoDisplay.style.display = 'none';
            imgDisplay.style.display = 'block';
            imgDisplay.src = url;
        }
    }
};

// تعريف المستقبل عالمياً ليراه ملف index.html
window.QUP_Sink = QUP_Sink;
window.processIncomingPulse = (data) => QUP_Sink.processPulse(data);
