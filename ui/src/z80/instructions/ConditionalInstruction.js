import Instruction from './Instruction';

function formatCondition(flag, condition) {
    return (condition ? '' : 'N') + flag;
}

export default class ConditionalInstruction extends Instruction {
    constructor(opcode, name, flag, condition, argumentPattern, extra = 0) {
        super(opcode, name, [formatCondition(flag, condition)].concat(argumentPattern), extra);
        this.flag = flag;
        this.condition = condition;
    }

    readableCondition() {
        return formatCondition(this.flag, this.condition);
    }

    isConditionSatisfied(state) {
        return state.registers['flag' + this.flag] === this.condition;
    }
}