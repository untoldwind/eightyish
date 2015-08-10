import InstructionFactory from './base';

class Jump extends InstructionFactory {
    constructor() {
        super(0xc3);
    }
}

export default [
    new Jump()
];