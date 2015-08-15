import InstructionFactory from './base';

import * as args from './ArgumentPatterns';

class DecrementRegister extends InstructionFactory {
    constructor(opcode, register) {
        super(opcode, 'DEC', [register]);
        this.register = register;
    }

    create(register) {
        return {
            assembler: `  DEC\t$(register}`,
            opcodes: (labels) => [this.opcode]
        }
    }
}

export default [
    new DecrementRegister(0x05, 'B')
];