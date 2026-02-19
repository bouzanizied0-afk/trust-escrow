// --- [QUP-v3: The Genesis Source - STABLE] ---
const QUP_Source = {
    threshold: 2,
    
    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async transmit(file) {
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now();
        const seed = Math.random();
        const hashLock = await this.calculateHash(rawData);

        // إرسال إشارة البداية (SYNC) لتجهيز المستقبل
        window.fbSet(window.streamRef, {
            t: 'SYNC', name: file.name, size: rawData.length, seed, sid, lock: hashLock
        });
        
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            await this.streamLayer(rawData, step, sid, seed);
        }

        window.fbSet(window.streamRef, { t: 'TERMINATE', sid });
    },
    
    async streamLayer(data, step, sid, seed) {
        let packet = "";
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            if (Math.abs(actual - predicted) > this.threshold) {
                // استخدام تنسيق B{index},{value}; ليفهمه المستقبل
                packet += "B" + i.toString(36) + "," + String.fromCharCode(0x4E00 + actual) + ";";
            }
            if (packet.length > 1000) {
                this.inject(packet, sid);
                packet = "";
                await new Promise(r => setTimeout(r, 40)); 
            }
        }
        if (packet) this.inject(packet, sid);
    },

    inject(d, sid) { 
        if (window.fbSet && window.streamRef) {
            window.fbSet(window.streamRef, { d, sid, t: 'DATA' }); 
        }
        if (window.updateProgressPulse) window.updateProgressPulse(1); 
    } 
};

window.QUP_Source = QUP_Source;
