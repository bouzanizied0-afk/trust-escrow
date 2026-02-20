// --- [QUP-ULTIMATE: The Radar Receiver] ---
// حافظنا على الـ Import لأنه هو الذي يضمن الاتصال بالسحاب عندك
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const QUP_Receiver = {
    engine: { buffer: null, sid: null, lock: null, name: null, w: 800, h: 600 },

    init() {
        const db = window.db;
        const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');

        onValue(streamRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            this.processPulse(data);
        });
    },

    processPulse(data) {
        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        switch(data.t) {
            case 'GENESIS':
                // تحديث العدادات
                if(document.getElementById('digital-counter')) document.getElementById('digital-counter').innerText = "0000000000";
                if(window.mainCounter) window.mainCounter.innerText = "0%";

                this.engine = { 
                    buffer: new Uint8Array(data.size), 
                    sid: data.sid, lock: data.lock, name: data.name,
                    w: data.w || 800, h: data.h || 600 
                };

                // إرسال نبضة التكوين للمترجم ليجهز الشاشة
                if (window.QUP_Translator) window.QUP_Translator.translate(ctx, data);
                break;

            case 'DATA':
                if (this.engine.sid !== data.sid) return;

                // تحديث النسبة والعداد
                if (data.c !== undefined) {
                    if(document.getElementById('digital-counter')) 
                        document.getElementById('digital-counter').innerText = String(data.c).padStart(10, '0');
                    if(window.mainCounter && this.engine.buffer)
                        window.mainCounter.innerText = Math.floor((data.c / this.engine.buffer.length) * 100) + "%";
                }

                // --- [ هنا الربط العبقري مع المترجم ] ---
                // بدلاً من فك التشفير يدوياً، نترك المهمة للمترجم ليرسم الـ S والـ X
                if (window.QUP_Translator) {
                    window.QUP_Translator.translate(ctx, {
                        d: data.d,
                        step: data.step,
                        c: data.c,
                        w: this.engine.w,
                        h: this.engine.h
                    });
                }
                break;

            case 'TERMINATE':
                if (this.engine.sid === data.sid) {
                    if(window.mainCounter) window.mainCounter.innerText = "100%";
                    // هنا يمكن إضافة وظيفة التجسيد النهائي (Materialize) إذا أردت تحميل الملف
                }
                break;
        }
    },

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    }
};

QUP_Receiver.init();
