
import Instruction from './base';

class Halt extends Instruction {
    constructor() {
        super(0x76, 'HALT', []);
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: 'HALT',
            opcodes: (labels) => [this.opcode],
            size: 1
        };
    }
}

class Nop extends Instruction {
    constructor() {
        super(0x00, 'NOP', []);
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: 'NOP',
            opcodes: (labels) => [this.opcode],
            size: 1
        };
    }
}

export default [
    new Nop(),
    new Halt()
];