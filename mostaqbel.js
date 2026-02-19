// --- [QUP-v2: Sink Engine - الذكاء الاصطناعي للمعاينة] ---
const QUP_Sink = {
    buffer: null,
    lastSid: null,
    totalSize: 0,
    fileName: "",

    getAtomicByte(tick, seed) {
        return Math.floor(((Math.sin(tick * 0.05 + seed) + Math.cos(tick * 0.02)) / 2 + 1) * 127.5);
    },

    processPulse(data) {
        if (!data) return;

        // نظام التقرير اللحظي (لنعرف ماذا يحدث)
        if (window.logToChat) {
            if (data.t === 'SYNC') window.logToChat("📥 استلمت إشارة SYNC: جاري تهيئة الذاكرة...");
            if (data.t === 'DATA') console.log("📥 استلمت نبضة بيانات...");
        }

        // 1. استقبال إشارة المزامنة
        if (data.t === 'SYNC' && data.sid !== this.lastSid) {
            this.lastSid = data.sid;
            this.totalSize = data.size;
            this.fileName = data.name;
            this.buffer = new Uint8Array(this.totalSize);
            
            for (let i = 0; i < this.totalSize; i++) {
                this.buffer[i] = this.getAtomicByte(i, data.seed);
            }
            return; 
        }

        // 2. الحقن المغناطيسي للبيانات
        if (data.t === 'DATA' && this.buffer) {
            const symbols = data.d.split(';');
            let successCount = 0;

            symbols.forEach(symbol => {
                if (!symbol || !symbol.includes(',')) return;
                const [meta, valChar] = symbol.split(',');
                if (meta.startsWith("B")) {
                    const index = parseInt(meta.substring(1), 36);
                    const value = valChar.charCodeAt(0) - 0x4E00;
                    if (index < this.buffer.length) {
                        this.buffer[index] = value;
                        successCount++;
                    }
                }
            });

            // تحديث العداد (هنا حل مشكلة العداد)
            if (window.updateProgressPulse) {
                // نرسل قيمة تصاعدية للعداد
                window.updateProgressPulse(successCount / this.totalSize || 0.1); 
            }

            // إشعار بالنجاح في الدردشة (مرة واحدة لكل حزمة)
            if (successCount > 0 && Math.random() > 0.9) {
                window.logToChat(`✅ تم حقن ${successCount} إحداثي في الذاكرة.`);
            }

            this.renderMedia();
            if (window.updateRotaryVisual) window.updateRotaryVisual(Math.floor(Math.random() * 999999999));
        } else if (data.t === 'DATA' && !this.buffer) {
            window.logToChat("⚠️ خطأ: وصلت بيانات قبل وصول إشارة المزامنة (SYNC)!");
        }
    },

    renderMedia() {
        const isVideo = this.fileName.toLowerCase().match(/\.(mp4|webm|mov)$/);
        const blob = new Blob([this.buffer], { type: isVideo ? 'video/mp4' : 'image/png' });
        const url = URL.createObjectURL(blob);
        
        const display = document.getElementById(isVideo ? 'videoScreen' : 'displayScreen');
        const other = document.getElementById(isVideo ? 'displayScreen' : 'videoScreen');
        
        if (display) {
            display.src = url;
            display.style.display = 'block';
            if (other) other.style.display = 'none';
            if (document.getElementById('placeholderText')) document.getElementById('placeholderText').style.display = 'none';
        }
    }
};

window.QUP_Sink = QUP_Sink;
// ربط القناة العالمية
window.processIncomingPulse = (data) => QUP_Sink.processPulse(data);
