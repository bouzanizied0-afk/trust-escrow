// --- [QUP-v2: Sink Engine / الحقن المغناطيسي] ---
const QUP_Sink = {
    buffer: null,
    lastSid: null,
    totalSize: 0,
    fileName: "", // أضفنا هذا المتغير هنا لحفظ الاسم

    getAtomicByte(tick, seed) {
        return Math.floor(((Math.sin(tick * 0.05 + seed) + Math.cos(tick * 0.02)) / 2 + 1) * 127.5);
    },

    processPulse(data) {
        if (!data) return;

        // 1. بروتوكول التزامن الأول (SYNC)
        if (data.t === 'SYNC' && data.sid !== this.lastSid) {
            this.lastSid = data.sid;
            this.totalSize = data.size;
            this.fileName = data.name; // استلام اسم الملف (صورة أو فيديو)
            this.buffer = new Uint8Array(this.totalSize);
            
            // حقن العطالة الأولية في الذاكرة
            for (let i = 0; i < this.totalSize; i++) {
                this.buffer[i] = this.getAtomicByte(i, data.seed);
            }
            console.log("📡 تم استقبال إشارة المزامنة: " + this.fileName);
            return; 
        }

            // 2. بروتوكول الحقن المغناطيسي (DATA)
    if (data.t === 'DATA' && this.buffer) {
        const symbols = data.d.split(';');
        symbols.forEach(symbol => {
            if (!symbol) return;
            const [meta, valChar] = symbol.split(',');
            if (meta && meta.startsWith("B")) {
                const index = parseInt(meta.substring(1), 36); // استعادة الإحداثي
                const value = valChar.charCodeAt(0) - 0x4E00; // استعادة القيمة
                
                // Direct Memory Injection (الحقن المباشر)
                this.buffer[index] = value;
            }
        });

        // تحديث الواجهة (النبض)
        if (window.updateProgressPulse) window.updateProgressPulse(1); 

        // --- [ كود التجسيد المادي الذكي: صورة + فيديو ] ---
        const isVideo = this.fileName && (this.fileName.toLowerCase().endsWith('.mp4') || this.fileName.toLowerCase().endsWith('.webm') || this.fileName.toLowerCase().endsWith('.mov'));
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

        // تحديث العداد الزمني للنشاط
        if (window.updateRotaryVisual) {
            window.updateRotaryVisual(Math.floor(Math.random() * 9999999999));
        }
    }
} // نهاية دالة processPulse
}; // نهاية كائن QUP_Sink

// ربط فيرباس بالمستقبل والقناة العالمية
window.QUP_Sink = QUP_Sink;
window.processIncomingPulse = (data) => QUP_Sink.processPulse(data);
