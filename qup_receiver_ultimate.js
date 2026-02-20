// --- [QUP-RECEIVER: THE RADAR BRIDGE] ---
export const QUP_Receiver = {
    engine: { buffer: null, w: 0, h: 0, sid: null },

    init() {
        const { ref, onValue } = window.FirebaseRTDB;
        onValue(ref(window.db, 'QUP_UNIVERSAL_STREAM'), (snap) => {
            const data = snap.val();
            if (data) this.processPulse(data);
        });
    },

    processPulse(data) {
        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas.getContext('2d');

        if (data.t === 'GENESIS') {
            this.engine = { buffer: new Uint8Array(data.size), w: data.w, h: data.h, sid: data.sid };
        }

        // إرسال النبضة للمترجم (التوافق التام)
        if (window.QUP_Translator) {
            window.QUP_Translator.translate(ctx, {
                d: data.d || "",
                step: data.step || 1,
                c: data.c || 0,
                w: this.engine.w || 800,
                h: this.engine.h || 600
            });
        }
        
        // منطق الـ Materialize يظل كما هو لتحميل الملف في النهاية
    }
};
QUP_Receiver.init();
