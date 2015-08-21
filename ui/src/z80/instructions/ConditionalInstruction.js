import Instruction from './Instruction'

import * as args from './ArgumentPatterns'

export default class ConditionalInstruction extends Instruction {
    constructor(opcode, name, flag, condition, argumentPattern) {
        super(opcode, name, [args.ConditionPattern(flag, condition)].concat(argumentPattern))
        this.flag = flag
        this.condition = condition
    }

    isConditionSatisfied(state) {
        return state.registers['flag' + this.flag] === this.condition
    }
}
