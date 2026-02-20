import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { QUP_Translator } from "./qup_pulse_interpreter.js";

const db = window.db;
const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');

export const QUP_Core = {
    threshold: 2,
    async transmit(file) {
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now(), seed = Math.random();
        const hashLock = await this.calculateHash(rawData);
        const w = 800, h = Math.ceil(rawData.length / w);

        await set(streamRef, { t: 'GENESIS', name: file.name, size: rawData.length, seed, sid, lock: hashLock, w, h });
        
        const canvas = document.getElementById('matrixCanvas');
        if (canvas) QUP_Translator.translate(canvas.getContext('2d'), { t: 'GENESIS', w, h });

        for (let step of [8, 4, 2, 1]) {
            await this.executeAtomicStream(rawData, step, sid, seed, w, h);
        }
        await set(streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },

        async executeAtomicStream(data, step, sid, seed, w, h) {
        let packet = "", skipCount = 0;
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = Math.floor(((Math.sin(i * 0.05 + seed) + Math.cos(i * 0.02)) / 2 + 1) * 127.5);
            
            if (Math.abs(actual - predicted) <= this.threshold) {
                skipCount++;
            } else {
                if (skipCount > 0) { packet += `S${skipCount}.`; skipCount = 0; }
                packet += `X${String.fromCharCode(0x4E00 + actual)}`;
            }

            // --- التعديل يبدأ هنا ---
            if (packet.length > 200 || i % 1000 === 0) { 
                const pulse = { d: packet, sid, step, t: 'DATA', c: i, w, h, seed };
                await this.sync(pulse);
                packet = "";
                await new Promise(r => setTimeout(r, 5)); 
            }
            // --- التعديل ينتهي هنا ---
        }
        if (packet || skipCount > 0) {
            if (skipCount > 0) packet += `S${skipCount}.`;
            await this.sync({ d: packet, sid, step, t: 'DATA', c: data.length, w, h, seed });
        }
    },

    async sync(pulse) {
        const canvas = document.getElementById('matrixCanvas');
        if (canvas) QUP_Translator.translate(canvas.getContext('2d'), pulse);
        await set(streamRef, pulse);
    },

    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};
document.getElementById('fileInput').onchange = (e) => QUP_Core.transmit(e.target.files[0]);
