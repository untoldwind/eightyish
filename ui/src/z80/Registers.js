export default class Registers {
    constructor(mem_size) {
        this.A = 0;
        this.F = 0;
        this.B = 0;
        this.C = 0;
        this.D = 0;
        this.E = 0;
        this.HL = 0;
        this.PC = 0;
        this.SP = mem_size;
        this.IX = 0;
        this.IY = 0;
        this.flagS = false;
        this.flagZ = false;
        this.flagH = false;
        this.flagP = false;
        this.flagN = false;
        this.flagC = false;
    }

    get AF() {
        return (this.A << 8) | this.F;
    }

    set AF(af) {
        this.A = (af >> 8) & 0xff;
        this.F = af & 0xff;
    }

    get BC() {
        return (this.B << 8) | this.C;
    }

    set BC(bc) {
        this.B = (bc >> 8) & 0xff;
        this.C = bc & 0xff;
    }

    get DE() {
        return (this.D << 8) | this.E;
    }

    set DE(de) {
        this.D = (de >> 8) & 0xff;
        this.E = de & 0xff;
    }

    get F() {
        let result = 0;
        if (this.flagC) result |= 0x1;
        if (this.flagN) result |= 0x2;
        if (this.flagP) result |= 0x4;
        if (this.flagH) result |= 0x10;
        if (this.flagZ) result |= 0x40;
        if (this.flagS) result |= 0x80;
        return result;
    }

    set F(f) {
        this.flagC = (f & 0x1) != 0;
        this.flagN = (f & 0x2) != 0;
        this.flagP = (f & 0x4) != 0;
        this.flagH = (f & 0x10) != 0;
        this.flagZ = (f & 0x40) != 0;
        this.flagS = (f & 0x80) != 0;
    }

    copy() {
        return Object.assign({__proto__: this.__proto__}, this);
    }

    assign(values) {
        Object.assign(this, values);
    }

}