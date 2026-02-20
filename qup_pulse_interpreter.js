/**
 * QUP-SYSTEM: UNIVERSAL TRANSLATOR UNIT
 * Strategic Directive: Sovereign Synchronization
 */

const Shared_Logic = {
    predict(t, s) {
        const val = Math.floor(((Math.sin(t * 0.05 + s) + Math.cos(t * 0.02)) / 2 + 1) * 127.5);
        return { r: val, g: val, b: val }; // توحيد القيمة الرمادية للبث المادي
    }
};

export const QUP_Translator = {
    translate(ctx, pulse, seed) {
        const { d: raw, w, h, c: clock } = pulse;
        
        // فرض سيادة الأبعاد
        if (ctx.canvas.width !== w || ctx.canvas.height !== h) {
            ctx.canvas.width = w;
            ctx.canvas.height = h;
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, w, h);
        }

        let currentClk = clock - this.countTotal(raw);
        let i = 0;

        while (i < raw.length) {
            if (raw[i] === 'S') {
                let end = raw.indexOf('.', i);
                let count = parseInt(raw.substring(i + 1, end));
                for (let s = 0; s < count; s++) {
                    const p = Shared_Logic.predict(currentClk, seed);
                    this.draw(ctx, currentClk, w, p.r, p.g, p.b);
                    currentClk++;
                }
                i = end + 1;
            } else if (raw[i] === 'X') {
                const val = raw.charCodeAt(i + 1) - 0x4E00;
                this.draw(ctx, currentClk, w, val, val, val);
                currentClk++;
                i += 2;
            } else i++;
        }
    },

    draw(ctx, clk, w, r, g, b) {
        const x = clk % w;
        const y = Math.floor(clk / w);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, 1, 1);
    },

    countTotal(raw) {
        let total = 0, i = 0;
        while (i < raw.length) {
            if (raw[i] === 'S') {
                let end = raw.indexOf('.', i);
                total += parseInt(raw.substring(i + 1, end));
                i = end + 1;
            } else if (raw[i] === 'X') {
                total += 1; i += 2;
            } else i++;
        }
        return total;
    }
};
