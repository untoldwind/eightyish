import Immutable from '../Immutable'

export default class Registers extends Immutable {
    constructor(memSize) {
        super()

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
        this.flagS = false
        this.flagZ = false
        this.flagH = false
        this.flagP = false
        this.flagN = false
        this.flagC = false
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
        result |= this.flagC ? 0x1 : 0x0
        result |= this.flagN ? 0x2 : 0x0
        result |= this.flagP ? 0x4 : 0x0
        result |= this.flagH ? 0x10 : 0x0
        result |= this.flagZ ? 0x40 : 0x0
        result |= this.flagS ? 0x80 : 0x0
        return result
    }

    set F(f) {
        this.flagC = (f & 0x1) !== 0
        this.flagN = (f & 0x2) !== 0
        this.flagP = (f & 0x4) !== 0
        this.flagH = (f & 0x10) !== 0
        this.flagZ = (f & 0x40) !== 0
        this.flagS = (f & 0x80) !== 0
    }
}

Registers.create = (memSize) => Object.freeze(new Registers(memSize))
