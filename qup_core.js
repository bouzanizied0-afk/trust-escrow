// --- [QUP-ULTIMATE: The Sovereign Engine] ---
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const Shared_Logic = {
    predict(t, s) {
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5);
    }
};

export const QUP_Core = {
    threshold: 2,
    
    async transmit(file) {
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now();
        const seed = Math.random();
        const hashLock = await this.calculateHash(rawData);
        
        // الحصول على أبعاد افتراضية للكانفاس بناءً على حجم البيانات (أو أبعاد ثابتة)
        const w = 800; 
        const h = Math.ceil(rawData.length / w);

        // 1. نبضة التكوين (GENESIS) مع الأبعاد والـ Seed
        await set(ref(window.db, 'QUP_UNIVERSAL_STREAM'), {
            t: 'GENESIS', name: file.name, size: rawData.length, 
            seed, sid, lock: hashLock, w, h
        });

        await this.executeAtomicStream(rawData, sid, seed, w, h);

        // 3. إنهاء الجلسة (TERMINATE)
        await set(ref(window.db, 'QUP_UNIVERSAL_STREAM'), { t: 'TERMINATE', sid, lock: hashLock });
    },

    async executeAtomicStream(data, sid, seed, w, h) {
        let packet = "";
        let skipCount = 0;
        const streamRef = ref(window.db, 'QUP_UNIVERSAL_STREAM');

        for (let i = 0; i < data.length; i++) {
            const actual = data[i];
            const predicted = Shared_Logic.predict(i, seed);
            
            if (Math.abs(actual - predicted) <= this.threshold) {
                skipCount++;
            } else {
                if (skipCount > 0) {
                    packet += `S${skipCount}.`;
                    skipCount = 0;
                }
                // بروتوكول X: تجسيد القيمة الحقيقية بترميز يونيكود مضغوط
                packet += `X${String.fromCharCode(0x4E00 + actual)}`;
            }

            // إرسال النبضة عند وصولها لحجم معين أو نهاية البيانات
            if (packet.length > 800 || i === data.length - 1) {
                if (skipCount > 0) { packet += `S${skipCount}.`; skipCount = 0; }
                
                const pulse = { d: packet, sid, t: 'DATA', c: i + 1, w, h };
                
                // تحديث الواجهة المحلية فوراً (المرسل يرى ما يرسل)
                const canvas = document.getElementById('matrixCanvas');
                if (canvas) QUP_Translator.translate(canvas.getContext('2d'), pulse, seed);

                await set(streamRef, pulse);
                packet = "";
                await new Promise(r => setTimeout(r, 10)); // موازنة الضغط
            }
            
            // تحديث العداد الرقمي
            if (i % 1000 === 0 && window.mainCounter) {
                window.mainCounter.innerText = Math.floor((i / data.length) * 100) + "%";
            }
        }
    },

    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

document.getElementById('fileInput').onchange = (e) => QUP_Core.transmit(e.target.files[0]);
