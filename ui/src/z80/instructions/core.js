
import InstructionFactory from './base';

class Halt extends InstructionFactory {
    constructor() {
        super(0x76);
    }
}

class Nop extends InstructionFactory {
    constructor() {
        super(0x00);
    }
}

export default [
    new Nop(),
    new Halt()
];