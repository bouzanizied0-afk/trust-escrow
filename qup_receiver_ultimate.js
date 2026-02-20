// --- [QUP-ULTIMATE: The Radar Receiver] ---
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { QUP_Translator } from "./QUP_Translator.js";

const Shared_Logic = {
    predict(t, s) {
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5);
    }
};

export const QUP_Receiver = {
    engine: { buffer: null, sid: null, seed: null, cursor: 0 },

    init() {
        onValue(ref(window.db, 'QUP_UNIVERSAL_STREAM'), (snapshot) => {
            const pulse = snapshot.val();
            if (!pulse) return;
            this.process(pulse);
        });
    },

    process(pulse) {
        switch(pulse.t) {
            case 'GENESIS':
                this.engine = { 
                    buffer: new Uint8Array(pulse.size), 
                    sid: pulse.sid, seed: pulse.seed, cursor: 0, 
                    name: pulse.name, lock: pulse.lock 
                };
                break;

            case 'DATA':
                if (this.engine.sid !== pulse.sid) return;
                
                // 1. التجسيد البصري عبر المترجم السيادي
                const ctx = document.getElementById('matrixCanvas').getContext('2d');
                QUP_Translator.translate(ctx, pulse, this.engine.seed);

                // 2. إعادة بناء المادة (البيانات)
                this.reconstruct(pulse.d);
                break;

            case 'TERMINATE':
                if (this.engine.sid === pulse.sid) this.materialize();
                break;
        }
    },

    reconstruct(dataString) {
        let i = 0;
        while (i < dataString.length) {
            if (dataString[i] === 'S') {
                let end = dataString.indexOf('.', i);
                let count = parseInt(dataString.substring(i + 1, end));
                for (let s = 0; s < count; s++) {
                    this.engine.buffer[this.engine.cursor] = Shared_Logic.predict(this.engine.cursor, this.engine.seed);
                    this.engine.cursor++;
                }
                i = end + 1;
            } else if (dataString[i] === 'X') {
                this.engine.buffer[this.engine.cursor] = dataString.charCodeAt(i + 1) - 0x4E00;
                this.engine.cursor++;
                i += 2;
            } else i++;
        }
    },

    async materialize() {
        const hashBuffer = await crypto.subtle.digest('SHA-256', this.engine.buffer);
        const finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        if (finalHash === this.engine.lock) {
            const blob = new Blob([this.engine.buffer]);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = this.engine.name;
            a.click();
        }
    }
};
QUP_Receiver.init();
