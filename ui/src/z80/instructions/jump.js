import InstructionFactory from './base';

class Jump extends InstructionFactory {
    constructor() {
        super(0xc3, ['JUMP']);
    }
}

export default [
    new Jump()
];