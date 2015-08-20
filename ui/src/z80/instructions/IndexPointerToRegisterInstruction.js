import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

export default class IndexPointerToRegisterInstruction extends Instruction {
    constructor(opcode, name, to, from, operation) {
        super(opcode, name, [to, new args.IndexPointerPattern(from)], 1);
        this.to = to;
        this.from = from;
        this.operation = operation;
    }

    createAssembler(to, from) {
        const offset = this.argumentPattern[1].extractValue(from);
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to} <- (${this.from}${offset})`,
            opcodes: () => this.opcodes.concat(parseInt(offset) & 0xff),
            size: this.size
        };
    }

    process(state, pcMem) {
        const offset = this.opcodes.length;
        const result =
            this.operation(state.registers[this.to], state.getMemoryByte(state.registers[this.from] + pcMem[offset]));
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result);
    }
}
