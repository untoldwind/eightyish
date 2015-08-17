import Instruction from './base';

import * as args from './ArgumentPatterns';

class SubRegisterToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'SUB', [to, from]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `SUB\t$(to} <- ${from}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, state.registers[this.to] - state.registers[this.from])
    }
}

export default [
    new SubRegisterToRegister(0x90, 'A', 'B'),
    new SubRegisterToRegister(0x91, 'A', 'C'),
    new SubRegisterToRegister(0x92, 'A', 'D'),
    new SubRegisterToRegister(0x93, 'A', 'E')
];