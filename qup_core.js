// --- [QUP-ULTIMATE: The Sovereign Engine] ---
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const db = window.db;
const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');

export const QUP_Core = {
    threshold: 2,
    
    async transmit(file) {
                const rawData = new Uint8Array(await file.arrayBuffer());
        if(document.getElementById('digital-counter')) document.getElementById('digital-counter').innerText = "0000000000";
        
        const sid = Date.now();
        const seed = Math.random();
        const hashLock = await this.calculateHash(rawData);

        // 1. نبضة التكوين (The Genesis Pulse)
        await set(streamRef, {
            t: 'GENESIS', name: file.name, size: rawData.length, 
            seed, sid, lock: hashLock
        });

        // 2. نظام الطبقات الكامل (Layered Perception) - [8, 4, 2, 1]
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            await this.executeAtomicStream(rawData, step, sid, seed);
        }

        // 3. نبضة اليقين الرياضي (TERMINATE)
        await set(streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },

    async executeAtomicStream(data, step, sid, seed) {
        let packet = "";
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            
            if (Math.abs(actual - predicted) > this.threshold) {
                // استخدام Base36 للضغط العالي وتقليل استهلاك البيانات
                packet += `${i.toString(36)}:${String.fromCharCode(0x4E00 + actual)}|`;
            }

            // تحديث العدادات بناءً على الحمل الحقيقي
                        if (i % 400 === 0) {
                // حساب النسبة المئوية
                const percent = Math.floor((i / data.length) * 100);
                
                // 1. تحديث النسبة المئوية
                window.mainCounter.innerText = percent + "%";

                // 2. تحديث العداد الرقمي (الأصفار) بالملي
                const digitalCounter = document.getElementById('digital-counter');
                if (digitalCounter) {
                    digitalCounter.innerText = String(i).padStart(10, '0');
                }
            }

            if (packet.length > 1000) {
                await set(streamRef, { d: packet, sid, step, t: 'DATA' });
                packet = "";
                await new Promise(r => setTimeout(r, 20)); // تدفق ناعم
            }
        }
        if (packet) await set(streamRef, { d: packet, sid, step, t: 'DATA' });
    },

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

document.getElementById('fileInput').onchange = (e) => QUP_Core.transmit(e.target.files[0]);
