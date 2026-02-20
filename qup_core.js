import { ref, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { QUP_Translator } from "./qup_pulse_interpreter.js";

const db = window.db;
const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');

export const QUP_Core = {
    threshold: 2,
    currentFileData: null,

    // 1. المعاينة الفورية عند اختيار الملف
    async handleFileSelect(file) {
        this.currentFileData = new Uint8Array(await file.arrayBuffer());
        const w = 800;
        const h = Math.ceil(this.currentFileData.length / w);
        const canvas = document.getElementById('matrixCanvas');
        
        // رسم المعاينة الأصلية للمرسل ليعرف ماذا يرسل
        QUP_Translator.translate(canvas.getContext('2d'), { t: 'GENESIS', w, h });
        this.drawFullImage(canvas, this.currentFileData, w, h);
    },

    drawFullImage(canvas, data, w, h) {
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(w, h);
        for(let i=0; i<data.length; i++) {
            const v = data[i];
            const p = i * 4;
            imgData.data[p]=v; imgData.data[p+1]=v; imgData.data[p+2]=v; imgData.data[p+3]=255;
        }
        ctx.putImageData(imgData, 0, 0);
    },

    // 2. عملية الإرسال المتزامن
    async transmit() {
        if(!this.currentFileData) return;
        const data = this.currentFileData;
        const sid = Date.now(), seed = Math.random();
        const hashLock = await this.calculateHash(data);
        const w = 800, h = Math.ceil(data.length / w);

        // نبضة التكوين الأولى
        await set(streamRef, { t: 'GENESIS', size: data.length, seed, sid, lock: hashLock, w, h });

        for (let step of [8, 4, 2, 1]) {
            let packet = "", skipCount = 0;
            for (let i = 0; i < data.length; i += step) {
                const actual = data[i];
                // استخدام i وليس ترتيب البكسل لضمان مزامنة الساعة مع الموقع
                const predicted = Math.floor(((Math.sin(i * 0.05 + seed) + Math.cos(i * 0.02)) / 2 + 1) * 127.5);
                
                if (Math.abs(actual - predicted) <= this.threshold) {
                    skipCount++;
                } else {
                    if (skipCount > 0) { packet += `S${skipCount}.`; skipCount = 0; }
                    packet += `X${String.fromCharCode(0x4E00 + actual)}`;
                }

                // إرسال حزم أصغر لزيادة سرعة التحديث البصري
                if (packet.length > 300 || i % 2000 === 0) {
                    const pulse = { d: packet, sid, step, t: 'DATA', c: Math.floor(i/step), w, h, seed, total: data.length, progress: i };
                    await update(streamRef, pulse); // استخدام update للمحافظة على بيانات GENESIS
                    QUP_Translator.translate(document.getElementById('matrixCanvas').getContext('2d'), pulse);
                    packet = "";
                    await new Promise(r => setTimeout(r, 5));
                }
            }
        }
        await update(streamRef, { t: 'TERMINATE' });
    },

    async calculateHash(data) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

document.getElementById('fileInput').onchange = (e) => QUP_Core.handleFileSelect(e.target.files[0]);
// افترض وجود زر إرسال في واجهتك
document.getElementById('sendBtn').onclick = () => QUP_Core.transmit();
