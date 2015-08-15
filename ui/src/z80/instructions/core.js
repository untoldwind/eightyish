
import InstructionFactory from './base';

class Halt extends InstructionFactory {
    constructor() {
        super(0x76, 'HALT', []);
    }

    create() {
        return {
            assembler: '  HALT',
            opcodes: (labels) => [this.opcode]
        };
    }
}

class Nop extends InstructionFactory {
    constructor() {
        super(0x00, 'NOP', []);
    }

    create() {
        return {
            assembler: '  NOP',
            opcodes: (labels) => [this.opcode]
        };
    }
}

export default [
    new Nop(),
    new Halt()
];