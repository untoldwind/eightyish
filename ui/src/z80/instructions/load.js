import Instruction from './base';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

class LoadRegisterToRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, 'LOAD', [to, from]);
        this.to = to;
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `LOAD\t$(to} <- ${from}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }
}

class LoadMemoryToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, 'LOAD', [to, args.PointerPattern]);
        this.to = to;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `LOAD\t$(to} <- ${from}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }
}

class LoadRegisterToMemory extends Instruction {
    constructor(opcode, from) {
        super(opcode, 'LOAD', [args.AddressOrLabelPattern, from]);
        this.from = from;
    }

    createAssembler(to, from) {
        return {
            type: 'instruction',
            assembler: `LOAD\t$(to} <- ${from}`,
            opcodes: (labels) => [this.opcode],
            size: 1
        }
    }
}

class LoadValueToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, 'LOAD', [to, args.ByteValuePattern], 1);
        this.to = to;
    }

    createAssembler(to, num) {
        var value = this.argumentPattern[1].extractValue(num);
        return {
            type: 'instruction',
            assembler: `LOAD\t${this.to} <- ${value}`,
            opcodes: (labels) => this.opcodes.concat(value),
            size: this.size
        }
    }

    process(state, pcMem) {
        return new Transition({
            PC: state.registers.PC + this.size,
            [this.to]: pcMem[1]
        })
    }

}
export default [
    new LoadRegisterToRegister(0x7f, 'A', 'A'),
    new LoadRegisterToRegister(0x78, 'A', 'B'),
    new LoadRegisterToRegister(0x79, 'A', 'C'),
    new LoadRegisterToRegister(0x7a, 'A', 'D'),
    new LoadRegisterToRegister(0x7b, 'A', 'E'),
    new LoadRegisterToRegister(0x7c, 'A', 'H'),
    new LoadRegisterToRegister(0x7d, 'A', 'L'),
    new LoadRegisterToRegister(0x47, 'B', 'A'),
    new LoadRegisterToRegister(0x40, 'B', 'B'),
    new LoadRegisterToRegister(0x41, 'B', 'C'),
    new LoadRegisterToRegister(0x42, 'B', 'D'),
    new LoadRegisterToRegister(0x43, 'B', 'E'),
    new LoadRegisterToRegister(0x44, 'B', 'H'),
    new LoadRegisterToRegister(0x45, 'B', 'L'),
    new LoadRegisterToRegister(0x4f, 'C', 'A'),
    new LoadRegisterToRegister(0x48, 'C', 'B'),
    new LoadRegisterToRegister(0x49, 'C', 'C'),
    new LoadRegisterToRegister(0x4a, 'C', 'D'),
    new LoadRegisterToRegister(0x4b, 'C', 'E'),
    new LoadRegisterToRegister(0x4c, 'C', 'H'),
    new LoadRegisterToRegister(0x4d, 'C', 'L'),
    new LoadRegisterToRegister(0x57, 'D', 'A'),
    new LoadRegisterToRegister(0x50, 'D', 'B'),
    new LoadRegisterToRegister(0x51, 'D', 'C'),
    new LoadRegisterToRegister(0x52, 'D', 'D'),
    new LoadRegisterToRegister(0x53, 'D', 'E'),
    new LoadRegisterToRegister(0x54, 'D', 'H'),
    new LoadRegisterToRegister(0x55, 'D', 'L'),
    new LoadRegisterToRegister(0x5f, 'E', 'A'),
    new LoadRegisterToRegister(0x58, 'E', 'B'),
    new LoadRegisterToRegister(0x59, 'E', 'C'),
    new LoadRegisterToRegister(0x5a, 'E', 'D'),
    new LoadRegisterToRegister(0x5b, 'E', 'E'),
    new LoadRegisterToRegister(0x5c, 'E', 'H'),
    new LoadRegisterToRegister(0x5d, 'E', 'L'),
    new LoadRegisterToRegister(0x67, 'H', 'A'),
    new LoadRegisterToRegister(0x60, 'H', 'B'),
    new LoadRegisterToRegister(0x61, 'H', 'C'),
    new LoadRegisterToRegister(0x62, 'H', 'D'),
    new LoadRegisterToRegister(0x63, 'H', 'E'),
    new LoadRegisterToRegister(0x64, 'H', 'H'),
    new LoadRegisterToRegister(0x65, 'H', 'L'),
    new LoadRegisterToRegister(0x6f, 'L', 'A'),
    new LoadRegisterToRegister(0x68, 'L', 'B'),
    new LoadRegisterToRegister(0x69, 'L', 'C'),
    new LoadRegisterToRegister(0x6a, 'L', 'D'),
    new LoadRegisterToRegister(0x6b, 'L', 'E'),
    new LoadRegisterToRegister(0x6c, 'L', 'H'),
    new LoadRegisterToRegister(0x6d, 'L', 'L'),
    new LoadRegisterToMemory(0x32, 'A'),
    new LoadValueToRegister(0x3e, 'A'),
    new LoadValueToRegister(0x06, 'B'),
    new LoadValueToRegister(0x0e, 'C'),
    new LoadValueToRegister(0x16, 'D'),
    new LoadValueToRegister(0x1e, 'E')
];