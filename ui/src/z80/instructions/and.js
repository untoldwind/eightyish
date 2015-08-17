import Instruction from './base';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class AndRegisterToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'AND', [to, from]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `AND\t${this.to} <- ${this.from}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        }
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, state.registers[this.to] & state.registers[this.from])
    }
}

class AndPointerToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'AND', [to, `(${from})`]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `AND\t${this.to} <- ${this.from}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        }
    }
}

class AndIndexPointerToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'AND', [to, new args.IndexPointerPattern(from)], 1);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        var offset = this.argumentPattern[1].extractOffset(from);
        return {
            type: 'instruction',
            assembler: `AND\t${this.to} <- (${this.from}${offset})`,
            opcodes: (labels) => this.opcodes.concat(parseInt(offset) & 0xff),
            size: this.size
        }
    }
}

class AndValueToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, 'AND', [to, args.ByteValuePattern], 1);
        this.to = to;
    }

    createAssembler(to, num) {
        var value = this.argumentPattern[1].extractValue(num);
        return {
            type: 'instruction',
            assembler: `AND\t${this.to} <- ${value}`,
            opcodes: (labels) => this.opcodes.concat(value),
            size: this.size
        }
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, state.registers[this.to] & pcMem[1])
    }
}

export default [
    new AndRegisterToRegister(0xa0, 'A', 'B'),
    new AndRegisterToRegister(0xa1, 'A', 'C'),
    new AndRegisterToRegister(0xa2, 'A', 'D'),
    new AndRegisterToRegister(0xa3, 'A', 'E'),
    new AndPointerToRegister(0xa6, 'A', 'HL'),
    new AndIndexPointerToRegister(0xdda6, 'A', 'IX'),
    new AndIndexPointerToRegister(0xfda6, 'A', 'IY'),
    new AndValueToRegister(0xe6, 'A')
]
