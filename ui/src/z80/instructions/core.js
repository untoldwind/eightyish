
import Instruction from './base';

class Halt extends Instruction {
    constructor() {
        super(0x76);
    }
}

class Nop extends Instruction {
    constructor() {
        super(0x00);
    }
}

export default [
    new Nop(),
    new Halt()
];