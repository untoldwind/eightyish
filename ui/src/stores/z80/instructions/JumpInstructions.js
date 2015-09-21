import Instruction from './Instruction'
import Transition from '../Transition'

import { JUMP, PC, WORD_VAL,
    COND_C, COND_NC, COND_P, COND_NP, COND_S, COND_NS, COND_Z, COND_NZ } from './constants'

class Jump extends Instruction {
    constructor() {
        super(0xc3, 10, JUMP, [WORD_VAL])
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister(PC, this.args[0].loader(state, pcMem.subarray(this.opcodes.length)))
    }
}

class ConditionalJump extends Instruction {
    constructor(opcode, condition) {
        super(opcode, 10, JUMP, [condition, WORD_VAL])
    }

    process(state, pcMem) {
        const argPcMem = pcMem.subarray(this.opcodes.length)
        if (this.args[0].loader(state, argPcMem)) {
            return new Transition().
                withWordRegister(PC, this.args[1].loader(state, argPcMem))
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size)
    }
}

export const name = JUMP
export const description = 'Jump to address with optional condition: JUMP [condition ,] address'
export const instructions = [
    new Jump(),
    new ConditionalJump(0xda, COND_C),
    new ConditionalJump(0xfa, COND_S),
    new ConditionalJump(0xd2, COND_NC),
    new ConditionalJump(0xc2, COND_NZ),
    new ConditionalJump(0xf2, COND_NS),
    new ConditionalJump(0xea, COND_NP),
    new ConditionalJump(0xe2, COND_P),
    new ConditionalJump(0xca, COND_Z)
]
