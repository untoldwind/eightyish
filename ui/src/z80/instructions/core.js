import Instruction from './base';

import Transition from '../Transition';

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

    process(registers, memory) {
        return undefined
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

    process(registers, memory) {
        return new Transition({PC: registers.PC + 1})
    }
}

export default [
    new Nop(),
    new Halt()
];