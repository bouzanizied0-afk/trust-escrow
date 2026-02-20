// --- [QUP-ULTIMATE: The Radar Receiver] ---
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
export const QUP_Receiver = {
    engine: { buffer: null, sid: null, lock: null, name: null, seed: null },

        init() {
        const db = window.db;
        const streamRef = ref(db, 'QUP_UNIVERSAL_STREAM');

        onValue(streamRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            this.processPulse(data);
        });
    },

    processPulse(data) {
        switch(data.t) {
                        case 'GENESIS':
                // طھطµظپظٹط± ط§ظ„ظˆط§ط¬ظ‡ط© ظپظˆط± ط¨ط¯ط، ط§ظ„طھظƒظˆظٹظ†
                if(document.getElementById('digital-counter')) document.getElementById('digital-counter').innerText = "0000000000";
                if(window.mainCounter) window.mainCounter.innerText = "0%";

                this.engine = { 
                    buffer: new Uint8Array(data.size), 
                    sid: data.sid, lock: data.lock, name: data.name, seed: data.seed 
                };

                // طھط´ظƒظٹظ„ ط·ط¨ظ‚ط© ط§ظ„ط´ط¨ط­ (Ghost Layer)
                for (let i = 0; i < data.size; i++) {
                    this.engine.buffer[i] = this.getAtomicByte(i, data.seed);
                }
                // ط§ط³طھط¯ط¹ط§ط، ط§ظ„ط±ط§ط¯ط§ط± ظپظˆط±ط§ظ‹ ظ„ظ…ط¹ط§ظٹظ†ط© "ط§ظ„ط´ط¨ط­"
                this.renderLivePreview(data);
                break;

                        case 'DATA':
                if (this.engine.sid !== data.sid) return;

                // --- [ ط§ظ„طھط²ط§ظ…ظ† ط§ظ„ظ„ط­ط¸ظٹ ظ„ظ„ط¹ط¯ط§ط¯ ظˆط§ظ„ظ†ط³ط¨ط© ] ---
                if (data.c !== undefined) {
                    if(document.getElementById('digital-counter')) 
                        document.getElementById('digital-counter').innerText = String(data.c).padStart(10, '0');
                    if(window.mainCounter && this.engine.buffer)
                        window.mainCounter.innerText = Math.floor((data.c / this.engine.buffer.length) * 100) + "%";
                }

                // --- [ ظ…ظ†ط·ظ‚ ط¨ظ†ط§ط، ط§ظ„ظ…ظ„ظپ ط§ظ„ط£طµظ„ظٹ ] ---
                const magnets = data.d.split('|');
                magnets.forEach(m => {
                    if (!m) return;
                    const [idx36, valChar] = m.split(':');
                    const index = parseInt(idx36, 36); 
                    this.engine.buffer[index] = valChar.charCodeAt(0) - 0x4E00;
                });
                
                 this.renderLivePreview(data);
                break;


            case 'TERMINATE':
                if (this.engine.sid === data.sid) {
                    // ط§ظ„طھط£ظƒط¯ ظ…ظ† ظˆطµظˆظ„ ط§ظ„ظ†ط³ط¨ط© ظ„ظ€ 100% ط¹ظ†ط¯ ط§ظ„ظ†ظ‡ط§ظٹط©
                    if(window.mainCounter) window.mainCounter.innerText = "100%";
                    this.materialize();
                }
                break;
        }
    },

    renderLivePreview(data) {
    // 1. ط§ظ„ظˆطµظˆظ„ ظ„ظ„ظˆط­ط© ط§ظ„ط±ط³ظ… (ط§ظ„ظƒط§ظ†ظپط§ط³)
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas || (!data.d && data.t !== 'GENESIS')) return;

    const ctx = canvas.getContext('2d');

    // 2. طھظپط¹ظٹظ„ ط§ظ„ظ…طھط±ط¬ظ…: طھط­ظˆظٹظ„ ط§ظ„ظ†ط¨ط¶ط© ط§ظ„ظ‚ط§ط¯ظ…ط© ط¥ظ„ظ‰ ط¨ظƒط³ظ„ط§طھ ظپظˆط±ط§ظ‹
    // ظ†ط±ط³ظ„ ظ„ظ‡ ط§ظ„ظ€ ctx ظˆط§ظ„ظ€ data ط§ظ„طھظٹ طھط­طھظˆظٹ ط¹ظ„ظ‰ (ط§ظ„ظ†ط¨ط¶ط©طŒ ط§ظ„ط¹ط¯ط§ط¯طŒ ظˆط§ظ„ط­ط¬ظ…)
    QUP_Translator.translate(ctx, data);
  },


    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async materialize() {
        // ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ظٹظ‚ظٹظ† ط§ظ„ط±ظٹط§ط¶ظٹ (Hash-Lock)
        const hashBuffer = await crypto.subtle.digest('SHA-256', this.engine.buffer);
        const finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (finalHash === this.engine.lock) {
            console.log("âœ… ط§ظ„طھط¬ط³ظٹط¯ ط§ظ„ظ…ط§ط¯ظٹ ظ…ظƒطھظ…ظ„.");
            const blob = new Blob([this.engine.buffer]);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = this.engine.name;
            a.click();
        }
        this.purge();
    },

    purge() { this.engine = { buffer: null, sid: null }; }
};

QUP_Receiver.init();
