import Instruction from './base';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class AddRegisterToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'ADD', [to, from]);
        this.to = to;
        this.from = from;
        this.byte = to.length == 1;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `ADD\t${this.to} <- ${this.from}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        }
    }

    process(state, pcMem) {
        if (this.byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, state.registers[this.to] + state.registers[this.from])
        } else {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withWordRegister(this.to, state.registers[this.to] + state.registers[this.from])
        }
    }
}

class AddPointerToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'ADD', [to, `(${from})`]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `ADD\t${this.to} <- ${this.from}`,
            opcodes: (labels) => this.opcodes,
            size: this.size
        }
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, state.registers[this.to] + state.getMemoryByte(state.registers[this.from]))
    }
}

class AddIndexPointerToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'ADD', [to, new args.IndexPointerPattern(from)], 1);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        let offset = this.argumentPattern[1].extractValue(from);
        return {
            type: 'instruction',
            assembler: `ADD\t${this.to} <- (${this.from}${offset})`,
            opcodes: (labels) => this.opcodes.concat(parseInt(offset) & 0xff),
            size: this.size
        }
    }
}

class AddValueToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, 'ADD', [to, args.ByteValuePattern], 1);
        this.to = to;
    }

    createAssembler(to, num) {
        let value = this.argumentPattern[1].extractValue(num);
        return {
            type: 'instruction',
            assembler: `ADD\t${this.to} <- ${value}`,
            opcodes: (labels) => this.opcodes.concat(value),
            size: this.size
        }
    }

    process(state, pcMem) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, state.registers[this.to] + pcMem[1])
    }
}

export default [
    new AddRegisterToRegister(0x09, 'HL', 'BC'),
    new AddRegisterToRegister(0x19, 'HL', 'DE'),
    new AddRegisterToRegister(0x29, 'HL', 'HL'),
    new AddRegisterToRegister(0x39, 'HL', 'SP'),
    new AddRegisterToRegister(0xdd09, 'IX', 'BC'),
    new AddRegisterToRegister(0xdd19, 'IX', 'DE'),
    new AddRegisterToRegister(0xdd29, 'IX', 'IX'),
    new AddRegisterToRegister(0xdd39, 'IX', 'SP'),
    new AddRegisterToRegister(0xfd09, 'IY', 'BC'),
    new AddRegisterToRegister(0xfd19, 'IY', 'DE'),
    new AddRegisterToRegister(0xfd29, 'IY', 'IX'),
    new AddRegisterToRegister(0xfd39, 'IY', 'SP'),
    new AddRegisterToRegister(0x80, 'A', 'B'),
    new AddRegisterToRegister(0x81, 'A', 'C'),
    new AddRegisterToRegister(0x82, 'A', 'D'),
    new AddRegisterToRegister(0x83, 'A', 'E'),
    new AddPointerToRegister(0x86, 'A', 'HL'),
    new AddIndexPointerToRegister(0xdd86, 'A', 'IX'),
    new AddIndexPointerToRegister(0xfd86, 'A', 'IY'),
    new AddValueToRegister(0xc6, 'A')
]
