import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

export default class ByteValueToRegisterInstruction extends Instruction {
    constructor(opcode, name, to, operation) {
        super(opcode, name, [to, args.ByteValuePattern], 1);
        this.to = to;
        this.operation = operation;
    }

    createAssembler(to, num) {
        let value = this.argumentPattern[1].extractValue(num);
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to} <- ${value}`,
            opcodes: (labels) => this.opcodes.concat(value),
            size: this.size
        }
    }

    process(state, pcMem) {
        let result = this.operation(state.registers[this.to], pcMem[1]);
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result)
    }
}
