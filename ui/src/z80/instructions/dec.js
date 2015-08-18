import Instruction from './Instruction';

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
        if (this.byte) {
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
    new DecrementRegister(0x3d, 'A'),
    new DecrementRegister(0x0b, 'BC'),
    new DecrementRegister(0x05, 'B'),
    new DecrementRegister(0x1b, 'DE'),
    new DecrementRegister(0x0d, 'C'),
    new DecrementRegister(0x15, 'D'),
    new DecrementRegister(0x1d, 'E'),
    new DecrementRegister(0x2b, 'HL'),
    new DecrementRegister(0xdd2b, 'IX'),
    new DecrementRegister(0xfd2b, 'IY'),
    new DecrementRegister(0x3b, 'SP')
];