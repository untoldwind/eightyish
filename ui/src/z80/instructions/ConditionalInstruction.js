import GenericInstruction from './GenericInstruction'

import * as args from './ArgumentPatterns'

export default class ConditionalInstruction extends GenericInstruction {
    constructor(opcode, name, flag, condition, argumentPattern, extra = 0) {
        super(opcode, name, [args.ConditionPattern(flag, condition)].concat(argumentPattern), extra)
        this.flag = flag
        this.condition = condition
    }

    isConditionSatisfied(state) {
        return state.registers['flag' + this.flag] === this.condition
    }
}
