import InstructionFactory from './base';

import * as args from './ArgumentPatterns';

class SubRegisterToRegister extends InstructionFactory {
    constructor(opcode, to, from) {
        super(opcode, 'SUB', [to, from]);
        this.to = to;
        this.from = from;
    }

    create(to, from) {
        return {
            assembler: `SUB\t$(to} <- ${from}`,
            opcodes: (labels) => [this.opcode]
        }
    }
}

export default [
    new SubRegisterToRegister(0x90, 'A', 'B'),
    new SubRegisterToRegister(0x91, 'A', 'C'),
    new SubRegisterToRegister(0x92, 'A', 'D'),
    new SubRegisterToRegister(0x93, 'A', 'E')
];