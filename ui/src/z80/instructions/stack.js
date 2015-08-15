import InstructionFactory from './base';

import * as args from './ArgumentPatterns';

class Push extends InstructionFactory {
    constructor(opcode, register) {
        super(opcode, 'PUSH', [register]);
    }

    create(register) {
        return {
            assembler: `PUSH\t${register}`,
            opcodes: (labels) => [this.opcode]
        }
    }
}

class Pop extends InstructionFactory {
    constructor(opcode, register) {
        super(opcode, 'POP', [register]);
    }

    create(register) {
        return {
            assembler: `POP\t${register}`,
            opcodes: (labels) => [this.opcode]
        }
    }
}

export default [
    new Push(0xc5, 'BC'),
    new Push(0xd5, 'DE'),
    new Push(0xe5, 'HL'),
    new Push(0xf5, 'AF'),
    new Push(0xdde5, 'IX'),
    new Push(0xfdf5, 'IY'),
    new Pop(0xc1, 'BC'),
    new Pop(0xd1, 'DE'),
    new Pop(0xe1, 'HL'),
    new Pop(0xf1, 'AF'),
    new Pop(0xdde1, 'IX'),
    new Pop(0xfdf1, 'IY')
];