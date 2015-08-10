import Instruction from './base';

class Jump extends Instruction {
    constructor() {
        super(0xc3);
    }
}

export default [
    new Jump()
];