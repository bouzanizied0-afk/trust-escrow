// --- [QUP-RECEIVER: THE RADAR] ---
window.QUP_Receiver = {
    engine: { buffer: null, sid: null, lock: null, name: null, seed: null },

    init() {
        const db = window.db;
        const { ref, onValue } = window.FirebaseRTDB;
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
                this.engine = { 
                    buffer: new Uint8Array(data.size), 
                    sid: data.sid, lock: data.lock, name: data.name, seed: data.seed 
                };
                for (let i = 0; i < data.size; i++) {
                    this.engine.buffer[i] = this.getAtomicByte(i, data.seed);
                }
                this.renderLivePreview(data);
                break;

            case 'DATA':
                if (this.engine.sid !== data.sid) return;
                const magnets = data.d.split('|');
                magnets.forEach(m => {
                    if (!m) return;
                    const [idx36, valChar] = m.split(':');
                    const index = parseInt(idx36, 36); 
                    if(this.engine.buffer) this.engine.buffer[index] = valChar.charCodeAt(0) - 0x4E00;
                });
                this.renderLivePreview(data);
                break;

            case 'TERMINATE':
                if (this.engine.sid === data.sid) this.materialize();
                break;
        }
    },

    renderLivePreview(data) {
        const canvas = document.getElementById('matrixCanvas');
        if (canvas && window.QUP_Translator) {
            window.QUP_Translator.translate(canvas.getContext('2d'), data);
        }
    },

    getAtomicByte(t, s) { 
        return Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5); 
    },

    async materialize() {
        const hashBuffer = await crypto.subtle.digest('SHA-256', this.engine.buffer);
        const finalHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        if (finalHash === this.engine.lock) {
            const blob = new Blob([this.engine.buffer]);
            const img = document.getElementById('tv-image');
            if(img) {
                img.src = URL.createObjectURL(blob);
                img.style.display = 'block';
            }
        }
    }
};
