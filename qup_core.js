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
        
        const w = 800;
        const h = Math.ceil(rawData.length / w);

        // 1. نبضة التكوين (GENESIS)
        await set(streamRef, {
            t: 'GENESIS', name: file.name, size: rawData.length, 
            seed, sid, lock: hashLock, w, h
        });

        // الرقابة البصرية الفورية
        const canvas = document.getElementById('matrixCanvas');
        if (canvas) {
            QUP_Translator.translate(canvas.getContext('2d'), { t: 'GENESIS', w, h });
        }

        // 2. نظام الطبقات (Layers)
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            await this.executeAtomicStream(rawData, step, sid, seed);
        }

        // 3. نبضة الإنهاء (TERMINATE)
        await set(streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },

    async executeAtomicStream(data, step, sid, seed) {
        let packet = "";
        let skipCount = 0;
        const w = 800;
        const h = Math.ceil(data.length / w);

        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            
            if (Math.abs(actual - predicted) <= this.threshold) {
                skipCount++; 
            } else {
                if (skipCount > 0) {
                    packet += `S${skipCount}.`;
                    skipCount = 0;
                }
                packet += `X${String.fromCharCode(0x4E00 + actual)}`;
            }

            if (i % 400 === 0) {
                if (window.mainCounter) window.mainCounter.innerText = Math.floor((i / data.length) * 100) + "%";
                const digitalCounter = document.getElementById('digital-counter');
                if (digitalCounter) digitalCounter.innerText = String(i).padStart(10, '0');
            }

            if (packet.length > 1000) {
                const pulse = { d: packet, sid, step, t: 'DATA', c: i, w, h, seed };
                const canvas = document.getElementById('matrixCanvas');
                if (canvas) QUP_Translator.translate(canvas.getContext('2d'), pulse);

                await set(streamRef, pulse);
                packet = "";
                await new Promise(r => setTimeout(r, 20)); 
            }
        } 

        if (packet || skipCount > 0) {
            if (skipCount > 0) packet += `S${skipCount}.`;
            const lastPulse = { d: packet, sid, step, t: 'DATA', c: data.length, w, h, seed };
            const canvas = document.getElementById('matrixCanvas');
            if (canvas) QUP_Translator.translate(canvas.getContext('2d'), lastPulse);
            await set(streamRef, lastPulse);
        }
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








