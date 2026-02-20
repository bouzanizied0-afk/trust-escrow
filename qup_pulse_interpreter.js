export const QUP_Translator = {
    getSpatioTemporalClock(t, s) {
        const val = Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5);
        return { r: val, g: val, b: val };
    },

    translate(ctx, pulse) {
        const { d: raw, step, c: clock, w, h, seed, t } = pulse;
        
        if (t === 'GENESIS') {
            ctx.canvas.width = w;
            ctx.canvas.height = h;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, w, h);
            return;
        }

        if (!raw) return;

        // حساب النقطة الزمنية التي بدأت منها الحزمة
        let currentClk = clock - this.countTotalEntities(raw);
        let i = 0;

        while (i < raw.length) {
            if (raw[i] === "S") { 
                let end = raw.indexOf(".", i);
                let count = parseInt(raw.substring(i + 1, end));
                for (let s = 0; s < count; s++) {
                    // نضرب في step لضمان وضع البكسل في إحداثياته الحقيقية في الصورة
                    this.renderEntity(ctx, currentClk * step, step, w, -1, 0, 0, seed);
                    currentClk++;
                }
                i = end + 1;
            } 
            else if (raw[i] === "X") { 
                const val = raw.charCodeAt(i + 1) - 0x4E00;
                this.renderEntity(ctx, currentClk * step, step, w, val, val, val, seed);
                currentClk++;
                i += 2; 
            } else i++;
        }
    },

    renderEntity(ctx, actualIdx, size, w, r, g, b, s) {
        const x = (actualIdx % w);
        const y = Math.floor(actualIdx / w);
        let fR, fG, fB;
        
        if (r === -1) {
            const pred = this.getSpatioTemporalClock(actualIdx, s);
            fR = pred.r; fG = pred.g; fB = pred.b;
        } else {
            fR = r; fG = r; fB = r; 
        }

        ctx.fillStyle = `rgb(${fR},${fG},${fB})`;
        // رسم مربع بحجم الخطوة الحالية لملء الفراغات بذكاء
        ctx.fillRect(x, y, size, size);
    },

    countTotalEntities(p) {
        let total = 0, i = 0;
        while(i < (p?.length || 0)) {
            if(p[i] === 'S') {
                let end = p.indexOf('.', i);
                total += parseInt(p.substring(i+1, end));
                i = end + 1;
            } else if(p[i] === 'X') {
                total += 1; i += 2;
            } else i++;
        }
        return total;
    }
};
