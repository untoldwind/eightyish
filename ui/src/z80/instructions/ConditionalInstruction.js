import Instruction from './Instruction'

import ConditionArgument from '../arguments/ConditionArgument'

export default class ConditionalInstruction extends Instruction {
    constructor(opcode, cycles, name, flag, condition, additionalArgs) {
        super(opcode, cycles, name, [ConditionArgument(flag, condition)].concat(additionalArgs))
        this.flag = flag
        this.condition = condition
    }

    isConditionSatisfied(state) {
        return state.registers['flag' + this.flag] === this.condition
    }
}
