import Instruction from './base';

import * as args from './ArgumentPatterns';

class Jump extends Instruction {
    constructor() {
        super(0xc3, 'JUMP', [args.AddressOrLabelPattern]);
    }

    createAssembler(labelOrAddress) {
        return {
            type: 'instruction',
            assembler: `JUMP\t${labelOrAddress}`,
            opcodes: (labels) => [this.opcode].concat(labels.getAddress(labelOrAddress)),
            size: 3
        };
    }
}

export default [
    new Jump()
];