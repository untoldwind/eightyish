import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class Call extends Instruction {
    constructor() {
        super(0xcd, 'CALL', [args.AddressOrLabelPattern], 2);
    }

    createAssembler(labelOrAddress) {
        return {
            type: 'instruction',
            assembler: `CALL\t${labelOrAddress}`,
            opcodes: (labels) => this.opcodes.concat(labels.getAddress(labelOrAddress)),
            size: this.size
        };
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', (pcMem[1] << 8) | pcMem[2]).
            withWordRegister('SP', state.registers.SP - 2).
            withWordAt(state.registers.SP - 2, state.registers.PC + this.size)
    }
}

class Return extends Instruction {
    constructor() {
        super(0xc9, 'RET', []);
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: 'RET',
            opcodes: (labels) => this.opcodes,
            size: this.size
        };
    }

    process(state, pcMem) {
        let returnAddress = state.getMemoryWord(state.registers.SP);
        return new Transition().
            withWordRegister('PC', returnAddress).
            withWordRegister('SP', state.registers.SP + 2)
    }
}

class CallCondition extends Instruction {
    constructor(opcode, flag, condition) {
        super(opcode, 'CALL', [(condition ? '' : 'N') + flag, args.AddressOrLabelPattern]);
        this.flag = flag;
        this.condition = condition;
    }

    createAssembler(condition, labelOrAddress) {
        return {
            type: 'instruction',
            assembler: `CALL\t${condition}, ${labelOrAddress}`,
            opcodes: (labels) => [this.opcode].concat(labels.getAddress(labelOrAddress)),
            size: 3
        };
    }
}

class ReturnCondition extends Instruction {
    constructor(opcode, flag, condition) {
        super(opcode, 'RET', [(condition ? '' : 'N') + flag]);
        this.flag = flag;
        this.condition = condition;
    }

    createAssembler(condition) {
        return {
            type: 'instruction',
            assembler: `RET\t${condition}`,
            opcodes: (labels) => [this.opcode],
            size: 1
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
]