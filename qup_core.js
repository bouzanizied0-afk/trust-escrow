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

        // 1. ظ†ط¨ط¶ط© ط§ظ„طھظƒظˆظٹظ† (The Genesis Pulse)
        await set(streamRef, {
            t: 'GENESIS', name: file.name, size: rawData.length, 
            seed, sid, lock: hashLock
        });

        // 2. ظ†ط¸ط§ظ… ط§ظ„ط·ط¨ظ‚ط§طھ ط§ظ„ظƒط§ظ…ظ„ (Layered Perception) - [8, 4, 2, 1]
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            await this.executeAtomicStream(rawData, step, sid, seed);
        }

        // 3. ظ†ط¨ط¶ط© ط§ظ„ظٹظ‚ظٹظ† ط§ظ„ط±ظٹط§ط¶ظٹ (TERMINATE)
        await set(streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },

    async executeAtomicStream(data, step, sid, seed) {
        let packet = "";
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            
            if (Math.abs(actual - predicted) > this.threshold) {
                // ط§ط³طھط®ط¯ط§ظ… Base36 ظ„ظ„ط¶ط؛ط· ط§ظ„ط¹ط§ظ„ظٹ ظˆطھظ‚ظ„ظٹظ„ ط§ط³طھظ‡ظ„ط§ظƒ ط§ظ„ط¨ظٹط§ظ†ط§طھ
                packet += `${i.toString(36)}:${String.fromCharCode(0x4E00 + actual)}|`;
            }

            // طھط­ط¯ظٹط« ط§ظ„ط¹ط¯ط§ط¯ط§طھ ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط§ظ„ط­ظ…ظ„ ط§ظ„ط­ظ‚ظٹظ‚ظٹ
                        if (i % 400 === 0) {
                // ط­ط³ط§ط¨ ط§ظ„ظ†ط³ط¨ط© ط§ظ„ظ…ط¦ظˆظٹط©
                const percent = Math.floor((i / data.length) * 100);
                
                // 1. طھط­ط¯ظٹط« ط§ظ„ظ†ط³ط¨ط© ط§ظ„ظ…ط¦ظˆظٹط©
                window.mainCounter.innerText = percent + "%";

                // 2. طھط­ط¯ظٹط« ط§ظ„ط¹ط¯ط§ط¯ ط§ظ„ط±ظ‚ظ…ظٹ (ط§ظ„ط£طµظپط§ط±) ط¨ط§ظ„ظ…ظ„ظٹ
                const digitalCounter = document.getElementById('digital-counter');
                if (digitalCounter) {
                    digitalCounter.innerText = String(i).padStart(10, '0');
                }
            }

                                    if (packet.length > 1000) {
                await set(streamRef, { d: packet, sid, step, t: 'DATA', c: i });
                packet = "";
                await new Promise(r => setTimeout(r, 20)); 
            }
        }
        if (packet) await set(streamRef, { d: packet, sid, step, t: 'DATA', c: data.length });
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
