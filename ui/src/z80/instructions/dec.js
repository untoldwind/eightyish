import Instruction from './base';

import * as args from './ArgumentPatterns';

class DecrementRegister extends Instruction {
    constructor(opcode, register) {
        super(opcode, 'DEC', [register]);
        this.register = register;
        this.byte = register.length == 1
    }

    createAssembler(register) {
        return {
            type: 'instruction',
            assembler: `DEC\t$(register}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }

    process(state, pcMem) {
        if (byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, state.registers[this.to] - 1)
        } else {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withWordRegister(this.to, state.registers[this.to] - 1)
        }
    }
}

export default [
    new IncrementRegister(0x3d, 'A'),
    new IncrementRegister(0x0b, 'BC'),
    new IncrementRegister(0x05, 'B'),
    new IncrementRegister(0x1b, 'DE'),
    new IncrementRegister(0x0d, 'C'),
    new IncrementRegister(0x15, 'D'),
    new IncrementRegister(0x1d, 'E'),
    new IncrementRegister(0x2b, 'HL'),
    new IncrementRegister(0xdd2b, 'IX'),
    new IncrementRegister(0xfd2b, 'IY'),
    new IncrementRegister(0x3b, 'SP')
];