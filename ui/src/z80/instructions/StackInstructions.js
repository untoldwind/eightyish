import Instruction from './Instruction'
import Transition from '../Transition'

import RegisterArgument from '../arguments/RegisterArgument'

import { PUSH, POP, IX, IY, BC, DE, HL, AF, SP, PC} from './constants'

class Push extends Instruction {
    constructor(opcode, cycles, register) {
        super(opcode, cycles, PUSH, [RegisterArgument(register)])
        this.register = register
    }

    process(state) {
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordRegister(SP, state.registers.SP - 2).
            withWordAt(state.registers.SP - 2, state.registers[this.register]).
            withCycles(this.cycles)
    }
}

class Pop extends Instruction {
    constructor(opcode, cycles, register) {
        super(opcode, cycles, POP, [RegisterArgument(register)])
        this.register = register
    }

    process(state) {
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordRegister(SP, state.registers.SP + 2).
            withWordRegister(this.register, state.getMemoryWord(state.registers.SP)).
            withCycles(this.cycles)
    }
}

export default [
    new Push(0xdde5, 15, IX),
    new Push(0xfde5, 15, IY),
    new Pop(0xdde1, 14, IX),
    new Pop(0xfde1, 14, IY)
].
    concat([BC, DE, HL, AF].map((register, i) => new Push(0xc5 + (i << 4), 11, register))).
    concat([BC, DE, HL, AF].map((register, i) => new Pop(0xc1 + (i << 4), 10, register)))
