// --- [QUP-v2: Source Engine / التزامن المطلق] ---
const QUP_Source = {
    clock: 0,
    seed: 0,
    threshold: 2, // دقة متناهية

    async transmit(file) {
        const rawData = new Uint8Array(await file.arrayBuffer());
        const sid = Date.now();
        this.seed = Math.random();
        
        // إرسال إشارة المزامنة الأولية (البوصلة)
        window.fbSet(window.streamRef, {
            t: 'SYNC',
            name: file.name,
            size: rawData.length,
            seed: this.seed,
            sid: sid
        });

        console.log("⏳ تم ضبط الساعة الذرية وبدء التوأمة الزمكانية...");
        this.processInertia(rawData, sid, file.name);
    },

    processInertia(data, sid, name) {
        let packet = "";
        this.clock = 0;

        for (let i = 0; i < data.length; i++) {
            const actual = data[i];
            // التوقع بناءً على عطالة الساعة
            const predicted = this.getAtomicByte(this.clock, this.seed);
            
            if (Math.abs(actual - predicted) > this.threshold) {
                // مغناطيس تصحيحي: إرسال الرمز "B" مع الإحداثي والقيمة
                // نستخدم ترميز عالي الكثافة (Universal Mapping)
                packet += "B" + i.toString(36) + "," + String.fromCharCode(0x4E00 + actual) + ";";
            }

            this.clock++;

            // ضخ المغناطيس عبر فيرباس عند اكتمال كثافة معينة
            if (packet.length > 1200) {
                this.injectToStream(packet, sid, name);
                packet = "";
            }
        }
        if (packet) this.injectToStream(packet, sid, name);
    },

    getAtomicByte(tick, seed) {
        // معادلة التوليد الشمولي
        return Math.floor(((Math.sin(tick * 0.05 + seed) + Math.cos(tick * 0.02)) / 2 + 1) * 127.5);
    },

    injectToStream(d, sid, name) {
        window.fbSet(window.streamRef, { d, sid, name, t: 'DATA' });
    }
};

// --- [ ربط المحرك بالواجهة العالمية ] ---
// 1. تعريف المحرك عالمياً لكي يراه ملف الـ index والأزرار (الجسر)
window.QUP_Source = QUP_Source;

// 2. تفعيل الحساس: يبدأ البث فور اختيار الملف من الجهاز
if (document.getElementById('fileInput')) {
    document.getElementById('fileInput').onchange = (e) => {
        if (e.target.files[0]) {
            QUP_Source.transmit(e.target.files[0]);
        }
    };
}

