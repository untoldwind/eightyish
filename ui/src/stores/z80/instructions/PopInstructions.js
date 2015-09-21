import Instruction from './Instruction'
import Transition from '../Transition'

import RegisterArgument from '../arguments/RegisterArgument'

import { POP, IX, IY, BC, DE, HL, AF, SP, PC} from './constants'

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

export const name = POP
export const description = 'Pop/transfer value from stack to target: POP target'
export const instructions = [
    new Pop(0xdde1, 14, IX),
    new Pop(0xfde1, 14, IY)
].
    concat([BC, DE, HL, AF].map((register, i) => new Pop(0xc1 + (i << 4), 10, register)))
