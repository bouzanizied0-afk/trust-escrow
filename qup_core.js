// --- [QUP-ULTIMATE: The Sovereign Engine - Fixed Version] ---

// استخدام روابط CDN لكي يفهمها المتصفح مباشرة
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const QUP_Core = {
    threshold: 2,
    
    async transmit(file, onProgress) {
        // استخدام القاعدة التي تم تعريفها في window عبر ملف index
        const db = window.db; 
        const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');
        
        const rawData = new Uint8Array(await file.arrayBuffer());
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
            await this.executeAtomicStream(db, streamRef, rawData, step, sid, seed, onProgress);
        }

        // 3. نبضة اليقين الرياضي (TERMINATE)
        await set(streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },

    async executeAtomicStream(db, streamRef, data, step, sid, seed, onProgress) {
        let packet = "";
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            
            if (Math.abs(actual - predicted) > this.threshold) {
                // استخدام Base36 للضغط العالي وتقليل استهلاك البيانات
                packet += `${i.toString(36)}:${String.fromCharCode(0x4E00 + actual)}|`;
            }

            // تحديث العداد في الواجهة (النسبة المئوية)
            if (i % 400 === 0 && onProgress) {
                const percent = Math.floor((i / data.length) * 100);
                onProgress(percent);
            }

            if (packet.length > 1000) {
                await set(streamRef, { d: packet, sid, step, t: 'DATA' });
                packet = "";
                await new Promise(r => setTimeout(r, 20)); // تدفق ناعم لعدم تجميد المتصفح
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

// تم ترك الربط لملف الـ index ليقوم به عند الضغط على الزر، لضمان استقلالية القالب
