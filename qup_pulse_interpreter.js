/**
 * QUP-SYSTEM: UNIVERSAL TRANSLATOR UNIT
 * Strategic Directive: Sovereign Synchronization
 */
export const QUP_Translator = {
    // المحرك الرياضي: تخليق المعلومة من العدم الزمني
    getSpatioTemporalClock(tick) {
        return {
            r: Math.floor((Math.sin(tick * 0.05) + 1) * 127.5),
            g: Math.floor((Math.cos(tick * 0.03) + 1) * 127.5),
            b: Math.floor((Math.sin(tick * 0.01) + 1) * 127.5)
        };
    },

    /**
     * المترجم الكلي: تجسيد النبضات إلى واقع (مرئي أو بياناتي)
     * @param {CanvasRenderingContext2D} ctx - إطار التجسيد البصري
     * @param {Object} pulse - النبضة القادمة (Data Pulse)
     */
    translate(ctx, pulse) {
        const { d: raw, step, c: clock, w, h, sid } = pulse;
        
        // منع الإطار الأسود: تحديث أبعاد الوجود فور تغير الجلسة
        if (ctx.canvas.width !== w || ctx.canvas.height !== h) {
            ctx.canvas.width = w;
            ctx.canvas.height = h;
            ctx.clearRect(0, 0, w, h);
        }

        let currentClk = clock - this.countTotalEntities(raw);
        let i = 0;

        while (i < raw.length) {
            if (raw[i] === "S") { // حالة التزامن المتوقع (Skip/Match)
                let end = raw.indexOf(".", i);
                let count = parseInt(raw.substring(i + 1, end));
                for (let s = 0; s < count; s++) {
                    this.renderEntity(ctx, currentClk, step, w, -1);
                    currentClk++;
                }
                i = end + 1;
            } else if (raw[i] === "X") { // حالة التجسيد المباشر (Explicit Data)
                const r = raw.charCodeAt(i + 1) - 0x4E00;
                const g = raw.charCodeAt(i + 2) - 0x5E00;
                const b = raw.charCodeAt(i + 3) - 0x6E00;
                this.renderEntity(ctx, currentClk, step, w, r, g, b);
                currentClk++;
                i += 4;
            } else i++;
        }
    },

    // عملية التجسيد (Rendering): تحويل التردد إلى مادة بصرية
    renderEntity(ctx, clk, step, w, r, g = 0, b = 0) {
        const entitiesPerRow = Math.ceil(w / step);
        const x = (clk % entitiesPerRow) * step;
        const y = Math.floor(clk / entitiesPerRow) * step;

        let finalR, finalG, finalB;

        if (r === -1) {
            // استدعاء التنبؤ الرياضي لملء الفراغ الوجودي
            const pred = this.getSpatioTemporalClock(clk);
            finalR = pred.r; finalG = pred.g; finalB = pred.b;
        } else {
            finalR = r; finalG = g; finalB = b;
        }

        ctx.fillStyle = `rgb(${finalR},${finalG},${finalB})`;
        // منع الفجوات البصرية لضمان تدفق الحالة
        const size = (step === 1) ? 1 : step + 0.6;
        ctx.fillRect(x, y, size, size);
    },

    countTotalEntities(p) {
        let total = 0, i = 0;
        while(i < p.length) {
            if(p[i] === 'S') {
                let end = p.indexOf('.', i);
                total += parseInt(p.substring(i+1, end));
                i = end + 1;
            } else if(p[i] === 'X') {
                total += 1; i += 4;
            } else i++;
        }
        return total;
    }
};
