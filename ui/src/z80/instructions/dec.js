import Instruction from './base';

import * as args from './ArgumentPatterns';

class DecrementRegister extends Instruction {
    constructor(opcode, register) {
        super(opcode, 'DEC', [register]);
        this.register = register;
    }

    createAssembler(register) {
        return {
            assembler: `  DEC\t$(register}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }
}

export default [
    new DecrementRegister(0x05, 'B')
];