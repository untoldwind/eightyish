import Instruction from './Instruction';
import Transition from '../Transition';

function _readableCondition(flag, condition) {
    return (condition ? '' : 'N') + flag
}

export default class ConditionalInstruction extends Instruction {
    constructor(opcode, name, flag, condition, argumentPattern,  extra = 0) {
        super(opcode, name, [_readableCondition(flag, condition)].concat(argumentPattern), extra);
        this.flag = flag;
        this.condition = condition;
    }

    readableCondition() {
        return _readableCondition(this.flag, this.condition)
    }

    isConditionStasified(state) {
        return state.registers['flag' + this.flag] == this.condition
    }
}
