import Instruction from './Instruction'

import * as args from './Arguments'

export default class ConditionalInstruction extends Instruction {
    constructor(opcode, name, flag, condition, additionalArgs) {
        super(opcode, name, [args.ConditionArgument(flag, condition)].concat(additionalArgs))
        this.flag = flag
        this.condition = condition
    }

    isConditionSatisfied(state) {
        return state.registers['flag' + this.flag] === this.condition
    }
}
