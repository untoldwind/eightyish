import Instruction from './Instruction';
import ConditionalInstruction from './ConditionalInstruction'
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

class ConditionalCall extends ConditionalInstruction {
    constructor(opcode, flag, condition) {
        super(opcode, 'CALL', flag, condition, [args.AddressOrLabelPattern], 2);
        this.flag = flag;
        this.condition = condition;
    }

    createAssembler(condition, labelOrAddress) {
        return {
            type: 'instruction',
            assembler: `CALL\t${this.readableCondition()}, ${labelOrAddress}`,
            opcodes: (labels) => this.opcodes.concat(labels.getAddress(labelOrAddress)),
            size: this.size
        };
    }

    process(state, pcMem) {
        if (this.isConditionStasified(state)) {
            return new Transition().
                withWordRegister('PC', (pcMem[1] << 8) | pcMem[2]).
                withWordRegister('SP', state.registers.SP - 2).
                withWordAt(state.registers.SP - 2, state.registers.PC + this.size)
        } else {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size)
        }
    }
}

class ConditionalReturn extends ConditionalInstruction {
    constructor(opcode, flag, condition) {
        super(opcode, 'RET', flag, condition, []);
        this.flag = flag;
        this.condition = condition;
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `RET\t${this.readableCondition()}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        };
    }

    process(state, pcMem) {
        if (this.isConditionStasified(state)) {
            let returnAddress = state.getMemoryWord(state.registers.SP);
            return new Transition().
                withWordRegister('PC', returnAddress).
                withWordRegister('SP', state.registers.SP + 2)
        } else {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size)
        }
    }
}

export default [
    new Call(),
    new ConditionalCall(0xc4, 'Z', false),
    new ConditionalCall(0xcc, 'Z', true),
    new ConditionalCall(0xd4, 'C', false),
    new ConditionalCall(0xdc, 'C', true),
    new ConditionalCall(0xe4, 'P', false),
    new ConditionalCall(0xec, 'P', true),
    new ConditionalCall(0xf4, 'S', false),
    new ConditionalCall(0xfc, 'S', true),
    new Return(),
    new ConditionalReturn(0xc0, 'Z', false),
    new ConditionalReturn(0xc8, 'Z', true),
    new ConditionalReturn(0xd0, 'C', false),
    new ConditionalReturn(0xd8, 'C', true),
    new ConditionalReturn(0xe0, 'P', false),
    new ConditionalReturn(0xe8, 'P', true),
    new ConditionalReturn(0xf0, 'S', false),
    new ConditionalReturn(0xf8, 'S', true)
]