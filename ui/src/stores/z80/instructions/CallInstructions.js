import Instruction from './Instruction'
import Transition from '../Transition'

import { CALL, RET, PC, SP, WORD_VAL,
    COND_C, COND_NC, COND_P, COND_NP, COND_S, COND_NS, COND_Z, COND_NZ } from './constants'

class Call extends Instruction {
    constructor() {
        super(0xcd, 17, CALL, [WORD_VAL])
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister(PC, this.args[0].loader(state, pcMem.subarray(this.opcodes.length))).
            withWordRegister(SP, state.registers.SP - 2).
            withWordAt(state.registers.SP - 2, state.registers.PC + this.size).
            withCycles(this.cycles)
    }
}

class Return extends Instruction {
    constructor() {
        super(0xc9, 11, RET, [])
    }

    process(state) {
        const returnAddress = state.getMemoryWord(state.registers.SP)
        return new Transition().
            withWordRegister(PC, returnAddress).
            withWordRegister(SP, state.registers.SP + 2).
            withCycles(this.cycles)
    }
}

class ConditionalCall extends Instruction {
    constructor(opcode, condition) {
        super(opcode, 17, CALL, [condition, WORD_VAL])
    }

    process(state, pcMem) {
        const argPcMem = pcMem.subarray(this.opcodes.length)
        if (this.args[0].loader(state, argPcMem)) {
            return new Transition().
                withWordRegister(PC, this.args[1].loader(state, argPcMem)).
                withWordRegister(SP, state.registers.SP - 2).
                withWordAt(state.registers.SP - 2, state.registers.PC + this.size).
                withCycles(this.cycles)
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withCycles(this.cycles)
    }
}

class ConditionalReturn extends Instruction {
    constructor(opcode, condition) {
        super(opcode, 11, RET, [condition])
    }

    process(state, pcMem) {
        const argPcMem = pcMem.subarray(this.opcodes.length)
        if (this.args[0].loader(state, argPcMem)) {
            const returnAddress = state.getMemoryWord(state.registers.SP)
            return new Transition().
                withWordRegister(PC, returnAddress).
                withWordRegister(SP, state.registers.SP + 2).
                withCycles(this.cycles)
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withCycles(this.cycles)
    }
}

export const instructions = [
    new Call(),
    new ConditionalCall(0xc4, COND_NZ),
    new ConditionalCall(0xcc, COND_Z),
    new ConditionalCall(0xd4, COND_NC),
    new ConditionalCall(0xdc, COND_C),
    new ConditionalCall(0xe4, COND_NP),
    new ConditionalCall(0xec, COND_P),
    new ConditionalCall(0xf4, COND_NS),
    new ConditionalCall(0xfc, COND_S),
    new Return(),
    new ConditionalReturn(0xc0, COND_NZ),
    new ConditionalReturn(0xc8, COND_Z),
    new ConditionalReturn(0xd0, COND_NC),
    new ConditionalReturn(0xd8, COND_C),
    new ConditionalReturn(0xe0, COND_NP),
    new ConditionalReturn(0xe8, COND_P),
    new ConditionalReturn(0xf0, COND_NS),
    new ConditionalReturn(0xf8, COND_S)
]
