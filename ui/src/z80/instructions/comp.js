import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class CompWithRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [to, from]);
        this.to = to;
        this.from = from;
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `COMP\t${to}, ${from}}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        };
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(state.registers[this.to] - state.registers[this.from]);
    }
}

class CompWithValue extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [to, args.ByteValuePattern], 1);
        this.to = to;
    }

    createAssembler(to, num) {
        const value = this.argumentPattern[1].extractValue(num);
        return {
            type: 'instruction',
            assembler: `COMP\t${to}, ${value}}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        };
    }

    process(state, pcMem) {
        const offset = this.opcodes.length;
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(state.registers[this.to] - pcMem[offset]);
    }
}

export default [
    new CompWithRegister(0xb8, 'A', 'B'),
    new CompWithRegister(0xb9, 'A', 'C'),
    new CompWithRegister(0xba, 'A', 'D'),
    new CompWithRegister(0xbb, 'A', 'E'),
    new CompWithValue(0xfe, 'A')
];