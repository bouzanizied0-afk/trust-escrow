// --- [QUP-v3: The Genesis Source - WITH HEARTBEAT] ---
const QUP_Source = {
    threshold: 2,
    pulseCounter: 0, // العداد الدوري اللي طلبته

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async transmit(file) {
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now();
        const seed = Math.random();

        window.fbSet(window.streamRef, {
            t: 'SYNC', name: file.name, size: rawData.length, seed, sid
        });
        
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            await this.streamLayer(rawData, step, sid, seed);
        }
    },
    
    async streamLayer(data, step, sid, seed) {
        let packet = "";
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            if (Math.abs(actual - predicted) > this.threshold) {
                packet += "B" + i.toString(36) + "," + String.fromCharCode(0x4E00 + actual) + ";";
            }
            if (packet.length > 1000) {
                this.inject(packet, sid, i / data.length); // نرسل النسبة هنا
                packet = "";
                await new Promise(r => setTimeout(r, 60)); 
            }
        }
    },

    inject(d, sid, progress) { 
        // 1. إرسال البيانات لفيرباس
        if (window.fbSet && window.streamRef) {
            window.fbSet(window.streamRef, { d, sid, t: 'DATA' }); 
        }

        // 2. العداد الدوري (من 1 إلى 10) اللي طلبته
        this.pulseCounter = (this.pulsePulse % 10) + 1;
        
        // 3. تحديث الواجهة (النسبة والعداد الدوري)
        if (window.updateProgressPulse) {
            window.updateProgressPulse(progress); // تحديث النسبة المئوية الحقيقية
        }
        
        if (window.updateRotaryVisual) {
            // نستخدم عدادك الدوري هنا ليدور من 1 لـ 10
            window.updateRotaryVisual(this.pulseCounter); 
        }
    } 
};

window.QUP_Source = QUP_Source;
