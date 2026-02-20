import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { QUP_Translator } from "./qup_pulse_interpreter.js";

export const QUP_Receiver = {
    engine: { buffer: null, sid: null, lock: null, name: null, seed: null },

    init() {
        onValue(ref(window.db, 'QUP_UNIVERSAL_STREAM'), (snapshot) => {
            const data = snapshot.val();
            if (data) this.processPulse(data);
        });
    },

    processPulse(data) {
        switch(data.t) {
            case 'GENESIS':
                this.engine = { 
                    buffer: new Uint8Array(data.size), 
                    sid: data.sid, lock: data.lock, name: data.name, seed: data.seed 
                };
                // بناء الحالة الصفرية (الشبح)
                for (let i = 0; i < data.size; i++) {
                    this.engine.buffer[i] = Math.floor(((Math.sin(i * 0.05 + data.seed) + Math.cos(i * 0.02)) / 2 + 1) * 127.5);
                }
                this.renderLive(data);
                break;

            case 'DATA':
                if (this.engine.sid !== data.sid) return;
                this.reconstructBuffer(data);
                this.renderLive(data);
                break;

            case 'TERMINATE':
                if (this.engine.sid === this.engine.sid) this.materialize();
                break;
        }
    },

    reconstructBuffer(pulse) {
        const raw = pulse.d;
        let currentIdx = pulse.c - QUP_Translator.countTotalEntities(raw);
        let i = 0;
        while (i < raw.length) {
            if (raw[i] === 'S') {
                let end = raw.indexOf('.', i);
                let count = parseInt(raw.substring(i + 1, end));
                for (let s = 0; s < count; s++) {
                    // البكسل مطابق للتوقع، نتركه كما هو في الـ buffer
                    currentIdx++;
                }
                i = end + 1;
            } else if (raw[i] === 'X') {
                this.engine.buffer[currentIdx] = raw.charCodeAt(i + 1) - 0x4E00;
                currentIdx++;
                i += 2;
            } else i++;
        }
    },

    renderLive(data) {
        const canvas = document.getElementById('matrixCanvas');
        if (canvas) QUP_Translator.translate(canvas.getContext('2d'), data);
        if (window.mainCounter && this.engine.buffer) 
            window.mainCounter.innerText = Math.floor((data.c / this.engine.buffer.length) * 100) + "%";
    },

    async materialize() {
        const hashBuffer = await crypto.subtle.digest('SHA-256', this.engine.buffer);
        const finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        if (finalHash === this.engine.lock) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([this.engine.buffer]));
            a.download = "QUP_" + this.engine.name;
            a.click();
        }
    }
};
QUP_Receiver.init();
