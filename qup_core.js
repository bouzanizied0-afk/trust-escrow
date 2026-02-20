// --- [QUP-CORE: THE SOVEREIGN TRANSMITTER] ---
export const QUP_Core = {
    async transmit(file) {
        const db = window.db;
        const { ref, set } = window.FirebaseRTDB;
        const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');
        
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now();
        const seed = Math.random();

        // استخراج الأبعاد (نحتاج إرسالها للمترجم)
        // ملاحظة: لتبسيط العرض نفترض عرضاً قياسياً أو نستخرجه من الصورة
        const w = 800; // يمكنك استخراج العرض الحقيقي من ملف الصورة
        const h = Math.ceil(rawData.length / w);

        await set(streamRef, {
            t: 'GENESIS', name: file.name, size: rawData.length, 
            seed, sid, w, h, lock: await this.calculateHash(rawData)
        });

        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            let packet = "";
            let currentIdx = 0;
            
            for (let i = 0; i < rawData.length; i += step) {
                const actual = rawData[i];
                const pred = this.getSpatioTemporalClock(i); // نفس معادلة المترجم
                
                // إذا كان اللون قريباً من التوقع نرسل S (تزامن)
                if (Math.abs(actual - pred.g) < 10) { 
                    let skipCount = 1;
                    packet += `S${skipCount}.`;
                } else {
                    // إرسال X (تجسيد صريح)
                    packet += `X${String.fromCharCode(0x4E00 + actual)}${String.fromCharCode(0x5E00 + actual)}${String.fromCharCode(0x6E00 + actual)}`;
                }

                if (packet.length > 500) {
                    await set(streamRef, { d: packet, sid, step, t: 'DATA', c: i, w, h });
                    packet = "";
                    await new Promise(r => setTimeout(r, 15));
                }
            }
        }
        await set(streamRef, { t: 'TERMINATE', sid });
    },

    // توحيد المعادلة مع المترجم
    getSpatioTemporalClock(tick) {
        return {
            g: Math.floor((Math.cos(tick * 0.03) + 1) * 127.5)
        };
    },

    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};
