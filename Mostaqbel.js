// --- [QUP-v3: The Genesis Sink / المستقبل المتوافق] ---
const QUP_Sink = {
    buffer: null,
    lastSid: null,
    totalSize: 0,
    fileName: "",

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    processPulse(data) {
        if (!data) return;

        // 1. استقبال نبضة البداية (تغيير SYNC إلى GENESIS)
        if (data.t === 'GENESIS' && data.sid !== this.lastSid) {
            this.lastSid = data.sid;
            this.totalSize = data.size;
            this.fileName = data.name;
            this.buffer = new Uint8Array(this.totalSize);
            
            // بناء طبقة الشبح (التوقعات الموجية)
            for (let i = 0; i < this.totalSize; i++) {
                this.buffer[i] = this.getAtomicByte(i, data.seed);
            }
            console.log("📡 تم فتح بوابة جينيسيس للملف: " + this.fileName);
            return;
        }

        // 2. استقبال حقن التفاصيل (تغيير DATA إلى INJECT وتغيير الرموز)
        if (data.t === 'INJECT' && this.buffer) {
            const symbols = data.d.split('|'); // المحرك v3 يستخدم |
            symbols.forEach(symbol => {
                if (!symbol) return;
                const [index36, valChar] = symbol.split(':'); // المحرك v3 يستخدم :
                if (index36 && valChar) {
                    const index = parseInt(index36, 36);
                    const value = valChar.charCodeAt(0) - 0x4E00;
                    this.buffer[index] = value;
                }
            });

            // تحديث شاشة العرض لحظياً
            this.render();
            
            // تحديث العداد والنسبة
            if (window.updateProgressPulse) window.updateProgressPulse(1); 
            if (window.updateRotaryVisual) window.updateRotaryVisual(Math.floor(Math.random() * 9999999));
        }
    },

    render() {
        if (!this.buffer) return;
        const isVideo = this.fileName && (this.fileName.toLowerCase().endsWith('.mp4') || this.fileName.toLowerCase().endsWith('.webm'));
        const blob = new Blob([this.buffer], { type: isVideo ? 'video/mp4' : 'image/png' });
        const url = URL.createObjectURL(blob);
        
        const imgDisplay = document.getElementById('displayScreen');
        const videoDisplay = document.getElementById('videoScreen');
        const placeholder = document.getElementById('placeholderText');

        if (placeholder) placeholder.style.display = 'none';

        if (isVideo) {
            imgDisplay.style.display = 'none';
            videoDisplay.style.display = 'block';
            if (videoDisplay.src !== url) videoDisplay.src = url;
        } else {
            videoDisplay.style.display = 'none';
            imgDisplay.style.display = 'block';
            imgDisplay.src = url;
        }
    }
};

window.QUP_Sink = QUP_Sink;
window.processIncomingPulse = (data) => QUP_Sink.processPulse(data);
