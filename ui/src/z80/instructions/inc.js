import Instruction from './base';

import * as args from './ArgumentPatterns';

class IncrementRegister extends Instruction {
    constructor(opcode, register) {
        super(opcode, 'INC', [register]);
        this.register = register;
        this.byte = register.length == 1
    }

    createAssembler(register) {
        return {
            type: 'instruction',
            assembler: `INC\t$(register}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }

    process(state, pcMem) {
        if (byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, state.registers[this.to] + 1)
        } else {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withWordRegister(this.to, state.registers[this.to] + 1)
        }
    }
}

export default [
    new IncrementRegister(0x3c, 'A'),
    new IncrementRegister(0x03, 'BC'),
    new IncrementRegister(0x04, 'B'),
    new IncrementRegister(0x13, 'DE'),
    new IncrementRegister(0x0c, 'C'),
    new IncrementRegister(0x14, 'D'),
    new IncrementRegister(0x1c, 'E'),
    new IncrementRegister(0x23, 'HL'),
    new IncrementRegister(0xdd23, 'IX'),
    new IncrementRegister(0xfd23, 'IY'),
    new IncrementRegister(0x33, 'SP')
];