import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

import { PUSH, POP, IX, IY, BC, DE, HL, AF, SP, PC} from './constants'

class Push extends Instruction {
    constructor(opcode, register) {
        super(opcode, PUSH, [args.RegisterPattern(register)])
        this.register = register
    }

    process(state) {
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordRegister(SP, state.registers.SP - 2).
            withWordAt(state.registers.SP - 2, state.registers[this.register])
    }
}

class Pop extends Instruction {
    constructor(opcode, register) {
        super(opcode, POP, [args.RegisterPattern(register)])
        this.register = register
    }

    process(state) {
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordRegister(SP, state.registers.SP + 2).
            withWordRegister(this.register, state.getMemoryWord(state.registers.SP))
    }
}

export default [
    new Push(0xdde5, IX),
    new Push(0xfde5, IY),
    new Pop(0xdde1, IX),
    new Pop(0xfde1, IY)
].
    concat([BC, DE, HL, AF].map((register, i) =>
            new Push(0xc5 + (i << 4), register)
    )).
    concat([BC, DE, HL, AF].map((register, i) =>
            new Pop(0xc1 + (i << 4), register)
    ))
