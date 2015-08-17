import Instruction from './base';

import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class AddRegisterToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'ADD', [to, from]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `ADD\t${this.to} <- ${this.from}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }

    process(registers, memory) {
        return new Transition({PC: registers.PC + 1, [this.to]: registers[this.to] + registers[this.from]})
    }
}

class AddPointerToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'ADD', [to, from]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `ADD\t${this.to} <- ${this.from}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }
}

export default [
    new AddRegisterToRegister(0x09, 'HL', 'BC'),
    new AddRegisterToRegister(0x19, 'HL', 'DE'),
    new AddRegisterToRegister(0x29, 'HL', 'HL'),
    new AddRegisterToRegister(0x39, 'HL', 'SP'),
    new AddRegisterToRegister(0x80, 'A', 'B'),
    new AddRegisterToRegister(0x81, 'A', 'C'),
    new AddRegisterToRegister(0x82, 'A', 'D'),
    new AddRegisterToRegister(0x83, 'A', 'E'),
    new AddPointerToRegister(0x86, 'A', '(HL)')
]
