import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import WordValueToRegisterInstruction from './WordValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

import { createFromRegisterInstructions } from './factory'

class LoadMemoryToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, 'LOAD', [args.RegisterPattern(to), args.PointerPattern], ' <- ')
        this.to = to
        this.byte = to.length === 1
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        if (this.byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, state.getMemoryByte((pcMem[offset] << 8) | pcMem[offset + 1]))
        }
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordRegister(this.to, state.getMemoryWord((pcMem[offset] << 8) | pcMem[offset + 1]))
    }
}

class LoadRegisterToMemory extends Instruction {
    constructor(opcode, from) {
        super(opcode, 'LOAD', [args.PointerPattern, args.RegisterPattern(from)], ' <- ')
        this.from = from
        this.byte = from.length === 1
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        if (this.byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteAt((pcMem[offset] << 8) | pcMem[offset + 1], state.registers[this.from])
        }
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordAt((pcMem[offset] << 8) | pcMem[offset + 1], state.registers[this.from])
    }
}

function operation(target, source) {
    return source
}

export default [
    new RegisterToRegisterInstruction(0xf9, 'LOAD', 'SP', 'HL', operation),
    new RegisterToRegisterInstruction(0xddf9, 'LOAD', 'SP', 'IX', operation),
    new RegisterToRegisterInstruction(0xfdf9, 'LOAD', 'SP', 'IY', operation),
    new PointerToRegisterInstruction(0x7e, 'LOAD', 'A', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd7e, 'LOAD', 'A', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd7e, 'LOAD', 'A', 'IY', operation),
    new PointerToRegisterInstruction(0x46, 'LOAD', 'B', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd46, 'LOAD', 'B', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd46, 'LOAD', 'B', 'IY', operation),
    new PointerToRegisterInstruction(0x4e, 'LOAD', 'C', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd4e, 'LOAD', 'C', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd4e, 'LOAD', 'C', 'IY', operation),
    new PointerToRegisterInstruction(0x56, 'LOAD', 'D', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd56, 'LOAD', 'D', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd56, 'LOAD', 'D', 'IY', operation),
    new PointerToRegisterInstruction(0x5e, 'LOAD', 'E', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd5e, 'LOAD', 'E', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd5e, 'LOAD', 'E', 'IY', operation),
    new LoadRegisterToMemory(0x32, 'A'),
    new LoadRegisterToMemory(0xed43, 'BC'),
    new LoadRegisterToMemory(0xed53, 'DE'),
    new LoadRegisterToMemory(0x22, 'HL'),
    new LoadRegisterToMemory(0xdd22, 'IX'),
    new LoadRegisterToMemory(0xfd22, 'IY'),
    new LoadRegisterToMemory(0x3d73, 'SP'),
    new LoadMemoryToRegister(0x3a, 'A'),
    new LoadMemoryToRegister(0xed4b, 'BC'),
    new LoadMemoryToRegister(0xed5b, 'DE'),
    new LoadMemoryToRegister(0x2a, 'HL'),
    new LoadMemoryToRegister(0xdd2a, 'IX'),
    new LoadMemoryToRegister(0xfd2a, 'IY'),
    new LoadMemoryToRegister(0xed7b, 'SP'),
    new ByteValueToRegisterInstruction(0x3e, 'LOAD', 'A', operation),
    new ByteValueToRegisterInstruction(0x06, 'LOAD', 'B', operation),
    new ByteValueToRegisterInstruction(0x0e, 'LOAD', 'C', operation),
    new ByteValueToRegisterInstruction(0x16, 'LOAD', 'D', operation),
    new ByteValueToRegisterInstruction(0x1e, 'LOAD', 'E', operation),
    new WordValueToRegisterInstruction(0x01, 'LOAD', 'BC', operation),
    new WordValueToRegisterInstruction(0x11, 'LOAD', 'DE', operation),
    new WordValueToRegisterInstruction(0x21, 'LOAD', 'HL', operation),
    new WordValueToRegisterInstruction(0xdd21, 'LOAD', 'IX', operation),
    new WordValueToRegisterInstruction(0xfd21, 'LOAD', 'IY', operation),
    new WordValueToRegisterInstruction(0x31, 'LOAD', 'SP', operation)
].
    concat(createFromRegisterInstructions(0x78, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, 'LOAD', 'A', register, operation))).
    concat(createFromRegisterInstructions(0x40, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, 'LOAD', 'B', register, operation))).
    concat(createFromRegisterInstructions(0x48, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, 'LOAD', 'C', register, operation))).
    concat(createFromRegisterInstructions(0x50, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, 'LOAD', 'D', register, operation))).
    concat(createFromRegisterInstructions(0x58, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, 'LOAD', 'E', register, operation)))
