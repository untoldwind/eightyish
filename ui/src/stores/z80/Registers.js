export default class Registers {
    constructor(memSize) {
        this.A = 0
        this.B = 0
        this.C = 0
        this.D = 0
        this.E = 0
        this.H = 0
        this.L = 0
        this.PC = 0
        this.SP = memSize
        this.IX = 0
        this.IY = 0
        this.flags = {
            S: false,
            Z: false,
            H: false,
            P: false,
            N: false,
            C: false
        }
    }

    get AF() {
        return (this.A << 8) | this.F
    }

    set AF(af) {
        this.A = (af >> 8) & 0xff
        this.F = af & 0xff
    }

    get BC() {
        return (this.B << 8) | this.C
    }

    set BC(bc) {
        this.B = (bc >> 8) & 0xff
        this.C = bc & 0xff
    }

    get DE() {
        return (this.D << 8) | this.E
    }

    set DE(de) {
        this.D = (de >> 8) & 0xff
        this.E = de & 0xff
    }

    get HL() {
        return (this.H << 8) | this.L
    }

    set HL(hl) {
        this.H = (hl >> 8) & 0xff
        this.L = hl & 0xff
    }

    get F() {
        let result = 0
        result |= this.flags.C ? 0x1 : 0x0
        result |= this.flags.N ? 0x2 : 0x0
        result |= this.flags.P ? 0x4 : 0x0
        result |= this.flags.H ? 0x10 : 0x0
        result |= this.flags.Z ? 0x40 : 0x0
        result |= this.flags.S ? 0x80 : 0x0
        return result
    }

    set F(f) {
        this.flags.C = (f & 0x1) !== 0
        this.flags.N = (f & 0x2) !== 0
        this.flags.P = (f & 0x4) !== 0
        this.flags.H = (f & 0x10) !== 0
        this.flags.Z = (f & 0x40) !== 0
        this.flags.S = (f & 0x80) !== 0
    }

    copy(...changes) {
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, ...changes)
    }
}
