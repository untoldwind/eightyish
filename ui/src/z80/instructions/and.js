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

    process(registers, memory) {
        return new Transition({PC: registers.PC + this.size, [this.to]: registers[this.to] & registers[this.from]})
    }
}

class AndPointerToRegister extends Instruction {
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

export default [
    new AndRegisterToRegister()
]
