import Instruction from './Instruction'
import ConditionalInstruction from './ConditionalInstruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

import { JUMP, PC } from './constants'

class Jump extends Instruction {
    constructor() {
        super(0xc3, JUMP, [args.AddressOrLabelPattern])
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister(PC, (pcMem[1] << 8) | pcMem[2])
    }
}

class ConditionalJump extends ConditionalInstruction {
    constructor(opcode, flag, condition) {
        super(opcode, JUMP, flag, condition, [args.AddressOrLabelPattern])
        this.flag = flag
        this.condition = condition
    }

    process(state, pcMem) {
        if (this.isConditionSatisfied(state)) {
            return new Transition().
                withWordRegister(PC, (pcMem[1] << 8) | pcMem[2])
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size)
    }
}

export default [
    new Jump(),
    new ConditionalJump(0xda, 'C', true),
    new ConditionalJump(0xfa, 'S', true),
    new ConditionalJump(0xd2, 'C', false),
    new ConditionalJump(0xc2, 'Z', false),
    new ConditionalJump(0xf2, 'S', false),
    new ConditionalJump(0xea, 'P', false),
    new ConditionalJump(0xe2, 'P', true),
    new ConditionalJump(0xca, 'Z', true)
]
