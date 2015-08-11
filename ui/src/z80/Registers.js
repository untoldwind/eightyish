
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
        this.SP = mem_size - 1;
        this.IX = 0;
        this.IY = 0;
    }

    get AF() {
        return (this.A  << 8) | this.F;
    }

    set AF(af) {
        this.A = (af >> 8) & 0xff;
        this.F = af & 0xff;
    }

    get BC() {
        return (this.B  << 8) | this.C;
    }

    set BC(bc) {
        this.B = (bc >> 8) & 0xff;
        this.C = bc & 0xff;
    }

    get DE() {
        return (this.D  << 8) | this.E;
    }

    set DE(de) {
        this.D = (de >> 8) & 0xff;
        this.E = de & 0xff;
    }

    copy() {
        return Object.assign({ __proto__: this.__proto__ }, this);
    }
}