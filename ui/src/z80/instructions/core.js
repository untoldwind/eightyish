
import InstructionFactory from './base';

class Halt extends InstructionFactory {
    constructor() {
        super(0x76, 'HALT', []);
    }

    create() {
        return {
            assembler: "HALT"
        };
    }
}

class Nop extends InstructionFactory {
    constructor() {
        super(0x00, 'NOP', []);
    }

    create() {
        return {
            assembler: "NOP"
        };
    }
}

export default [
    new Nop(),
    new Halt()
];