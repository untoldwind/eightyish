import InstructionFactory from './base';

import * as args from './ArgumentPatterns';

class IncrementRegister extends InstructionFactory {
    constructor(opcode, register) {
        super(opcode, 'INC', [register]);
        this.register = register;
    }

    create(register) {
        return {
            assembler: `  INC\t$(register}`,
            opcodes: (labels) => [this.opcode]
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