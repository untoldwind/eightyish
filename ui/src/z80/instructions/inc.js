import Instruction from './base';

import * as args from './ArgumentPatterns';

class IncrementRegister extends Instruction {
    constructor(opcode, register) {
        super(opcode, 'INC', [register]);
        this.register = register;
    }

    createAssembler(register) {
        return {
            type: 'instruction',
            assembler: `INC\t$(register}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }
}

export default [
    new IncrementRegister(0x03, 'BC'),
    new IncrementRegister(0x04, 'B'),
    new IncrementRegister(0x13, 'DE'),
    new IncrementRegister(0x0c, 'C'),
    new IncrementRegister(0x14, 'D'),
    new IncrementRegister(0x1c, 'E')
];