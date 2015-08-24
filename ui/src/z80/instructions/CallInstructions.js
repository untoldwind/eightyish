import Instruction from './Instruction'
import ConditionalInstruction from './ConditionalInstruction'
import Transition from '../Transition'

import { CALL, RET, PC, SP, WORD_VAL } from './constants'

class Call extends Instruction {
    constructor() {
        super(0xcd, 17, CALL, [WORD_VAL])
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister(PC, (pcMem[1] << 8) | pcMem[2]).
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

class ConditionalCall extends ConditionalInstruction {
    constructor(opcode, flag, condition) {
        super(opcode, 17, CALL, flag, condition, [WORD_VAL])
        this.flag = flag
        this.condition = condition
    }

    process(state, pcMem) {
        if (this.isConditionSatisfied(state)) {
            return new Transition().
                withWordRegister(PC, (pcMem[1] << 8) | pcMem[2]).
                withWordRegister(SP, state.registers.SP - 2).
                withWordAt(state.registers.SP - 2, state.registers.PC + this.size).
                withCycles(this.cycles)
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withCycles(this.cycles)
    }
}

class ConditionalReturn extends ConditionalInstruction {
    constructor(opcode, flag, condition) {
        super(opcode, 11, RET, flag, condition, [])
        this.flag = flag
        this.condition = condition
    }

    process(state) {
        if (this.isConditionSatisfied(state)) {
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

export default [
    new Call(),
    new ConditionalCall(0xc4, 'Z', false),
    new ConditionalCall(0xcc, 'Z', true),
    new ConditionalCall(0xd4, 'C', false),
    new ConditionalCall(0xdc, 'C', true),
    new ConditionalCall(0xe4, 'P', false),
    new ConditionalCall(0xec, 'P', true),
    new ConditionalCall(0xf4, 'S', false),
    new ConditionalCall(0xfc, 'S', true),
    new Return(),
    new ConditionalReturn(0xc0, 'Z', false),
    new ConditionalReturn(0xc8, 'Z', true),
    new ConditionalReturn(0xd0, 'C', false),
    new ConditionalReturn(0xd8, 'C', true),
    new ConditionalReturn(0xe0, 'P', false),
    new ConditionalReturn(0xe8, 'P', true),
    new ConditionalReturn(0xf0, 'S', false),
    new ConditionalReturn(0xf8, 'S', true)
]
