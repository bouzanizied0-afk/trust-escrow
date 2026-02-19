// --- [QUP-v2: Sink Engine / الحقن المغناطيسي] ---
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

        // 1. بروتوكول التزامن الأول (تعديل ليتوافق مع GENESIS)
        if (data.t === 'GENESIS' && data.sid !== this.lastSid) {
            this.lastSid = data.sid;
            this.totalSize = data.size;
            this.fileName = data.name; 
            this.buffer = new Uint8Array(this.totalSize);
            
            for (let i = 0; i < this.totalSize; i++) {
                this.buffer[i] = this.getAtomicByte(i, data.seed);
            }
            console.log("📡 تم استقبال إشارة جينيسيس: " + this.fileName);
            return; 
        }

        // 2. بروتوكول الحقن (تعديل ليتوافق مع INJECT)
        if (data.t === 'INJECT' && this.buffer) {
            // التعديل الجوهري هنا: تغيير الفواصل لتطابق المحرك v3
            const symbols = data.d.split('|'); // استخدام | بدلاً من ;
            symbols.forEach(symbol => {
                if (!symbol) return;
                const [meta, valChar] = symbol.split(':'); // استخدام : بدلاً من ,
                if (meta && valChar) {
                    const index = parseInt(meta, 36); // في v3 لا نستخدم حرف B، المحرك يرسل الرقم مباشرة
                    const value = valChar.charCodeAt(0) - 0x4E00;
                    
                    if (index >= 0 && index < this.buffer.length) {
                        this.buffer[index] = value;
                    }
                }
            });

            // تحديث الواجهة والنسبة
            if (window.updateProgressPulse) window.updateProgressPulse(1); 

            // --- كود التجسيد المادي ---
            const isVideo = this.fileName && (this.fileName.toLowerCase().endsWith('.mp4') || this.fileName.toLowerCase().endsWith('.webm'));
            const mimeType = isVideo ? 'video/mp4' : 'image/png';
            
            const blob = new Blob([this.buffer], { type: mimeType });
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

            // تفعيل العداد الزمني (سيعمل الآن لأن الكود لم يتوقف عند أخطاء التفكيك)
            if (window.updateRotaryVisual) {
                window.updateRotaryVisual(Math.floor(Math.random() * 9999999999));
            }
        }
    }
};

window.QUP_Sink = QUP_Sink;
window.processIncomingPulse = (data) => QUP_Sink.processPulse(data);
