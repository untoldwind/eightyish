import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

export default class PointerToRegisterInstruction extends Instruction {
    constructor(opcode, name, to, from, operation) {
        super(opcode, name, [to, `(${from})`]);
        this.to = to;
        this.from = from;
        this.operation = operation;
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to} <- (${this.from})`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        }
    }

    process(state, pcMem) {
        let result = this.operation(state.registers[this.to], state.getMemoryByte(state.registers[this.from]));
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result)
    }
}
