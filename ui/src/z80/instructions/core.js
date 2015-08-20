import Instruction from './Instruction';

import Transition from '../Transition';

class Halt extends Instruction {
    constructor() {
        super(0x76, 'HALT', []);
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: 'HALT',
            opcodes: () => [this.opcode],
            size: 1
        };
    }

    process() {
        return null;
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
            opcodes: () => [this.opcode],
            size: 1
        };
    }

    process(state) {
        return new Transition({PC: state.registers.PC + 1});
    }
}

export default [
    new Nop(),
    new Halt()
];
