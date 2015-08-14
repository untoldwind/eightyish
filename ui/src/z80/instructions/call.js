
import * as args from './ArgumentPatterns';

import InstructionFactory from './base';

class Call extends InstructionFactory {
    constructor() {
        super(0xcd, 'CALL', [args.AddressOrLabelPattern]);
    }

    create(labelOrAddress) {
        return {
            assembler: `CALL\t${labelOrAddress}`
        };
    }
}

class Return extends InstructionFactory {
    constructor() {
        super(0xc9, 'RET', []);
    }

    create() {
        return {
            assembler: 'RET'
        };
    }
}

class CallCondition extends InstructionFactory {
    constructor(opcode, flag, condition) {
        super(opcode, 'CALL', [(condition ? '' : 'N') + flag, args.AddressOrLabelPattern]);
        this.flag = flag;
        this.condition = condition;
    }

    create(condition, labelOrAddress) {
        return {
            assembler: `CALL\t${condition}, ${labelOrAddress}`
        };
    }
}

class ReturnCondition extends InstructionFactory {
    constructor(opcode, flag, condition) {
        super(opcode, 'RET', [(condition ? '' : 'N') + flag]);
        this.flag = flag;
        this.condition = condition;
    }

    create(condition) {
        return {
            assembler: `RET\t${condition}`
        };
    }
}

export default [
    new Call(),
    new CallCondition(0xc4, 'Z', false),
    new CallCondition(0xcc, 'Z', true),
    new CallCondition(0xd4, 'C', false),
    new CallCondition(0xdc, 'C', true),
    new CallCondition(0xe4, 'P', false),
    new CallCondition(0xec, 'P', true),
    new CallCondition(0xf4, 'S', false),
    new CallCondition(0xfc, 'S', true),
    new Return(),
    new ReturnCondition(0xc0, 'Z', false),
    new ReturnCondition(0xc8, 'Z', true),
    new ReturnCondition(0xd0, 'C', false),
    new ReturnCondition(0xd8, 'C', true),
    new ReturnCondition(0xe0, 'P', false),
    new ReturnCondition(0xe8, 'P', true),
    new ReturnCondition(0xf0, 'S', false),
    new ReturnCondition(0xf8, 'S', true)
];