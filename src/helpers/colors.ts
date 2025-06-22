type Colors = {
    HEX: string;
    RGB: string;
    RGBA: string;
    HSL: string;
    HSLA: string;
    CMYK: string;
    LAB: string;
}

function rgbToLab(r: number, g: number, b: number): string {
    const srgbToLinear = (c: number) =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const R = srgbToLinear(r / 255);
    const G = srgbToLinear(g / 255);
    const B = srgbToLinear(b / 255);

    const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
    const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
    const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;

    const Xn = 0.95047;
    const Yn = 1.0;
    const Zn = 1.08883;

    const f = (t: number) =>
        t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116;

    const L = 116 * f(Y / Yn) - 16;
    const a = 500 * (f(X / Xn) - f(Y / Yn));
    const bVal = 200 * (f(Y / Yn) - f(Z / Zn));

    return `lab(${L.toFixed(2)}, ${a.toFixed(2)}, ${bVal.toFixed(2)})`;
}

function rgbToCmyk(r: number, g: number, b: number): string {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const c = (1 - rNorm - k) / (1 - k) || 0;
    const m = (1 - gNorm - k) / (1 - k) || 0;
    const y = (1 - bNorm - k) / (1 - k) || 0;

    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(
        y * 100
    )}%, ${Math.round(k * 100)}%)`;
}

export function hexToColorVariants(hex: string): Colors {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const rgb = `rgb(${r}, ${g}, ${b})`;
    const rgba = `rgba(${r}, ${g}, ${b}, 1)`;

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));
        switch (max) {
            case rNorm:
                h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) % 6;
                break;
            case gNorm:
                h = (bNorm - rNorm) / delta + 2;
                break;
            case bNorm:
                h = (rNorm - gNorm) / delta + 4;
                break;
        }
        h *= 60;
    }

    const hsl = `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
    )}%)`;
    const hsla = `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
    )}%, 1)`;

    return {
        HEX: hex,
        RGB: rgb,
        RGBA: rgba,
        HSL: hsl,
        HSLA: hsla,
        CMYK: rgbToCmyk(r, g, b),
        LAB: rgbToLab(r, g, b),
    };
}
