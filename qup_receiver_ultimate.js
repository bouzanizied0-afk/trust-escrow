// --- [QUP-ULTIMATE: The Radar Receiver] ---
import { QUP_Translator } from './QUP_Pulse_Interpreter.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const QUP_Receiver = {
    engine: { buffer: null, sid: null, lock: null, name: null, seed: null },

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
        switch(data.t) {
                        case 'GENESIS':
                // تصفير الواجهة فور بدء التكوين
                if(document.getElementById('digital-counter')) document.getElementById('digital-counter').innerText = "0000000000";
                if(window.mainCounter) window.mainCounter.innerText = "0%";

                this.engine = { 
                    buffer: new Uint8Array(data.size), 
                    sid: data.sid, lock: data.lock, name: data.name, seed: data.seed 
                };

                // تشكيل طبقة الشبح (Ghost Layer)
                for (let i = 0; i < data.size; i++) {
                    this.engine.buffer[i] = this.getAtomicByte(i, data.seed);
                }
                // استدعاء الرادار فوراً لمعاينة "الشبح"
                this.renderLivePreview(data);
                break;

                        case 'DATA':
                if (this.engine.sid !== data.sid) return;

                // --- [ التزامن اللحظي للعداد والنسبة ] ---
                if (data.c !== undefined) {
                    if(document.getElementById('digital-counter')) 
                        document.getElementById('digital-counter').innerText = String(data.c).padStart(10, '0');
                    if(window.mainCounter && this.engine.buffer)
                        window.mainCounter.innerText = Math.floor((data.c / this.engine.buffer.length) * 100) + "%";
                }

                // --- [ منطق بناء الملف الأصلي ] ---
                const magnets = data.d.split('|');
                magnets.forEach(m => {
                    if (!m) return;
                    const [idx36, valChar] = m.split(':');
                    const index = parseInt(idx36, 36); 
                    this.engine.buffer[index] = valChar.charCodeAt(0) - 0x4E00;
                });
                
                 this.renderLivePreview(data);
                break;


            case 'TERMINATE':
                if (this.engine.sid === data.sid) {
                    // التأكد من وصول النسبة لـ 100% عند النهاية
                    if(window.mainCounter) window.mainCounter.innerText = "100%";
                    this.materialize();
                }
                break;
        }
    },

    renderLivePreview(data) {
    // 1. الوصول للوحة الرسم (الكانفاس)
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas || (!data.d && data.t !== 'GENESIS')) return;

    const ctx = canvas.getContext('2d');

    // 2. تفعيل المترجم: تحويل النبضة القادمة إلى بكسلات فوراً
    // نرسل له الـ ctx والـ data التي تحتوي على (النبضة، العداد، والحجم)
    QUP_Translator.translate(ctx, data);
  },


    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async materialize() {
        // التحقق من اليقين الرياضي (Hash-Lock)
        const hashBuffer = await crypto.subtle.digest('SHA-256', this.engine.buffer);
        const finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (finalHash === this.engine.lock) {
            console.log("✅ التجسيد المادي مكتمل.");
            const blob = new Blob([this.engine.buffer]);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = this.engine.name;
            a.click();
        }
        this.purge();
    },

    purge() { this.engine = { buffer: null, sid: null }; }
};

QUP_Receiver.init();
