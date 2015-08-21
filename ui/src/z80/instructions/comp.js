import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class CompWithRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.RegisterPattern(from)]);
        this.to = to;
        this.from = from;
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `COMP\t${this.to}, ${this.from}`,
            opcodes: () => this.opcodes,
            size: this.size
        };
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(state.registers[this.to] - state.registers[this.from]);
    }
}

class CompWithPointer extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.RegisterPointerPattern(from)]);
        this.to = to;
        this.from = from;
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to}, (${this.from})`,
            opcodes: () => this.opcodes,
            size: this.size
        };
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(this.to, state.registers[this.to] - state.getMemoryByte(state.registers[this.from]));
    }
}

class CompWithIndexPointer extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.IndexPointerPattern(from)], 1);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        const offset = this.argumentPattern[1].extractValue(from);
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to}, (${this.from}${offset})`,
            opcodes: () => this.opcodes.concat(parseInt(offset) & 0xff),
            size: this.size
        };
    }

    process(state, pcMem) {
        const offset = this.opcodes.length;
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(this.to, state.registers[this.to] -
            state.getMemoryByte(state.registers[this.from] + pcMem[offset]));
    }
}

class CompWithValue extends Instruction {
    constructor(opcode, to) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.ByteValuePattern], 1);
        this.to = to;
    }

    createAssembler(to, num) {
        const value = this.argumentPattern[1].extractValue(num);
        return {
            type: 'instruction',
            assembler: `COMP\t${to}, ${value}`,
            opcodes: () => this.opcodes.concat([value]),
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
    new CompWithValue(0xfe, 'A'),
    new CompWithPointer(0xbe, 'A', 'HL'),
    new CompWithIndexPointer(0xddbe, 'A', 'IX'),
    new CompWithIndexPointer(0xfdbe, 'A', 'IY')
];
