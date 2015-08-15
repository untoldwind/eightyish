import InstructionFactory from './base';

import * as args from './ArgumentPatterns';

class Jump extends InstructionFactory {
    constructor() {
        super(0xc3, 'JUMP', [args.AddressOrLabelPattern]);
    }

    create(labelOrAddress) {
        return {
            assembler: `JUMP\t${labelOrAddress}`,
            opcodes: (labels) => [this.opcode, labels.getAddress(labelOrAddress)]
        };
    }
}

export default [
    new Jump()
];