
import InstructionFactory from './base';

class Halt extends InstructionFactory {
    constructor() {
        super(0x76, ['HALT']);
    }
}

class Nop extends InstructionFactory {
    constructor() {
        super(0x00, ['NOP']);
    }
}

export default [
    new Nop(),
    new Halt()
];