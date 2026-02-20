// --- [QUP-CORE: THE TRANSMITTER] ---
window.QUP_Core = {
    threshold: 2,
    
    async transmit(file) {
        // الوصول لقاعدة البيانات من النافذة العامة
        const db = window.db;
        const { ref, set } = window.FirebaseRTDB; // سنعتمد على التصدير الذي سنضعه في index
        const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');

        const rawData = new Uint8Array(await file.arrayBuffer());
        if(document.getElementById('digital-counter')) document.getElementById('digital-counter').innerText = "0000000000";
        
        const sid = Date.now();
        const seed = Math.random();
        const hashLock = await this.calculateHash(rawData);
        
        // 1. نبضة التكوين
        await set(streamRef, {
            t: 'GENESIS', name: file.name, size: rawData.length, 
            seed, sid, lock: hashLock
        });

        const canvas = document.getElementById('matrixCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;

        // 2. نظام الطبقات
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            let packet = "";
            for (let i = 0; i < rawData.length; i += step) {
                const actual = rawData[i];
                const predicted = this.getAtomicByte(i, seed);
                
                if (Math.abs(actual - predicted) > this.threshold) {
                    packet += `${i.toString(36)}:${String.fromCharCode(0x4E00 + actual)}|`;
                }

                if (i % 400 === 0) {
                    const percent = Math.floor((i / rawData.length) * 100);
                    window.mainCounter.innerText = percent + "%";
                    if (document.getElementById('digital-counter')) {
                        document.getElementById('digital-counter').innerText = String(i).padStart(10, '0');
                    }
                }

                if (packet.length > 1000) {
                    const pulse = { d: packet, sid, step, t: 'DATA', c: i };
                    if (ctx && window.QUP_Translator) window.QUP_Translator.translate(ctx, pulse);
                    await set(streamRef, pulse);
                    packet = "";
                    await new Promise(r => setTimeout(r, 10)); 
                }
            }
            if (packet) {
                const lastPulse = { d: packet, sid, step, t: 'DATA', c: rawData.length };
                if (ctx && window.QUP_Translator) window.QUP_Translator.translate(ctx, lastPulse);
                await set(streamRef, lastPulse);
            }
        }

        // 3. النهاية
        await set(streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },

    getAtomicByte(t, s) {
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};
