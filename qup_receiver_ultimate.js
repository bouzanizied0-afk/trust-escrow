import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { QUP_Translator } from "./qup_pulse_interpreter.js";

export const QUP_Receiver = {
    engine: { buffer: null, sid: null, lock: null, name: null, seed: null },

    init() {
        onValue(ref(window.db, 'QUP_UNIVERSAL_STREAM'), (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            
            // تحديث العدادات من أي نبضة تحتوي على تقدم
            if (data.progress !== undefined) {
                if(document.getElementById('digital-counter')) 
                    document.getElementById('digital-counter').innerText = String(data.progress).padStart(10, '0');
                if(window.mainCounter && data.total)
                    window.mainCounter.innerText = Math.floor((data.progress / data.total) * 100) + "%";
            }

            this.processPulse(data);
        });
    },

    processPulse(data) {
        if (data.t === 'GENESIS' && this.engine.sid !== data.sid) {
            this.engine = { 
                buffer: new Uint8Array(data.size), 
                sid: data.sid, lock: data.lock, w: data.w, h: data.h, seed: data.seed 
            };
            QUP_Translator.translate(document.getElementById('matrixCanvas').getContext('2d'), data);
        } 
        else if (data.t === 'DATA' && this.engine.sid === data.sid) {
            this.reconstructBuffer(data);
            QUP_Translator.translate(document.getElementById('matrixCanvas').getContext('2d'), data);
        }
        else if (data.t === 'TERMINATE' && this.engine.sid) {
            this.materialize();
        }
    },

    reconstructBuffer(pulse) {
        const raw = pulse.d;
        const step = pulse.step;
        // المؤشر المنطقي في مصفوفة الطبقة الحالية
        let logicalIdx = pulse.c - QUP_Translator.countTotalEntities(raw);
        let i = 0;
        while (i < raw.length) {
            // الإحداثي الحقيقي في الملف النهائي
            let actualIdx = logicalIdx * step;
            if (raw[i] === 'S') {
                let end = raw.indexOf('.', i);
                let count = parseInt(raw.substring(i + 1, end));
                for (let s = 0; s < count; s++) {
                    // المزامنة: نكتب القيمة المتوقعة في الـ buffer الحقيقي
                    let aIdx = (logicalIdx + s) * step;
                    if(aIdx < this.engine.buffer.length) {
                        this.engine.buffer[aIdx] = Math.floor(((Math.sin(aIdx * 0.05 + pulse.seed) + Math.cos(aIdx * 0.02)) / 2 + 1) * 127.5);
                    }
                }
                logicalIdx += count;
                i = end + 1;
            } else if (raw[i] === 'X') {
                if(actualIdx < this.engine.buffer.length) {
                    this.engine.buffer[actualIdx] = raw.charCodeAt(i + 1) - 0x4E00;
                }
                logicalIdx++;
                i += 2;
            } else i++;
        }
    },

    async materialize() {
        const hashBuffer = await crypto.subtle.digest('SHA-256', this.engine.buffer);
        const finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        if (finalHash === this.engine.lock) {
            const blob = new Blob([this.engine.buffer]);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = "QUP_RENDERED.png";
            a.click();
            this.engine.sid = null; // تنظيف الجلسة
        }
    }
};
QUP_Receiver.init();
