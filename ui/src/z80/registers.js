
export default class Registers {
    constructor(mem_size) {
        this.A = 0;
        this.B = 0;
        this.C = 0;
        this.D = 0;
        this.E = 0;
        this.HL = 0;
        this.PC = 0;
        this.SP = mem_size - 1;
        this.IX = 0;
        this.IY = 0;
        this.flagC = false;
        this.flagS = false;
        this.flagP = false;
    }

    copy() {
        return Object.assign({ __proto__: this.__proto__ }, this);
    }
}