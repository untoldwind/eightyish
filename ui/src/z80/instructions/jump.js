import InstructionFactory from './base';

import * as args from './ArgumentPatterns';

class Jump extends InstructionFactory {
    constructor() {
        super(0xc3, 'JUMP', [args.AddressOrLabelPattern]);
    }
}

export default [
    new Jump()
];