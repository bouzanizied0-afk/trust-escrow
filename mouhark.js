// --- [QUP-v3: The Genesis Source] ---
const QUP_Source = {
    threshold: 2,
    
    async transmit(file) {
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now();
        const seed = Math.random();

        // حساب البصمة الذرية (Hash-Lock) لليقين الرياضي
        const hashLock = await this.calculateHash(rawData);

        // 1. إرسال نبضة البداية (The Genesis Pulse)
        window.fbSet(window.streamRef, {
            t: 'GENESIS', name: file.name, size: rawData.length, seed, sid, lock: hashLock
        });
        
        // 2. إطلاق "نظام الطبقات" (Layered Perception)
        // الطبقة 0: إرسال الأوامر للمستقبل لبناء "طبقة الشبح" (التوقعات الموجية)
        // الطبقات التالية: حقن "مغناطيس التفاصيل" (Detail Magnets)
        const layers = [8, 4, 2, 1]; 
        for (let step of layers) {
            await this.streamLayer(rawData, step, sid, seed);
        }

        // 3. بروتوكول الختام (TERMINATE)
        window.fbSet(window.streamRef, { t: 'TERMINATE', sid, lock: hashLock });
    },
    
    async streamLayer(data, step, sid, seed) {
        let packet = "";
        for (let i = 0; i < data.length; i += step) {
            const actual = data[i];
            const predicted = this.getAtomicByte(i, seed);
            if (Math.abs(actual - predicted) > this.threshold) {
                packet += i.toString(36) + ":" + String.fromCharCode(0x4E00 + actual) + "|";
            }
            if (packet.length > 1500) {
                this.inject(packet, sid, step);
                packet = "";
                await new Promise(r => setTimeout(r, 50)); // موازنة التدفق
            }
        }
        if (packet) this.inject(packet, sid, step);
    },

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async calculateHash(data) {
        const msgUint8 = data;
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

                inject(d, sid, step) { 
        // 1. إرسال البيانات للسحابة
        if (window.fbSet && window.streamRef) {
            window.fbSet(window.streamRef, { d, sid, step, t: 'INJECT' }); 
        }

        // 2. تحديث العداد (هذا ما يبحث عنه المحلل)
        if (window.updateProgressPulse) {
            window.updateProgressPulse(1); 
        }
    } 
}; // <--- إغلاق الكائن النهائي (QUP_Source) يجب أن يكون هنا

// الآن نضع "الجاسوس" خارج الكائن ليعمل فور تحميل الملف
(function() {
    window.engineStatus = "LOADED";
    // تعريف يدوي للتأكد من الرؤية العالمية
    window.QUP_Source = QUP_Source; 
    alert("✅ المحرك: تم تحميل ملف mouhark.js بنجاح");
})();

