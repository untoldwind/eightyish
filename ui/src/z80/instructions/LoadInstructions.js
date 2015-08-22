import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import WordValueToRegisterInstruction from './WordValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

import { createFromRegisterInstructions, createToRegisterInstructions } from './factory'

import { LOAD, HL, IX, IY, SP, PC, BC, DE } from './constants'

class LoadMemoryToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, LOAD, [args.RegisterPattern(to), args.PointerPattern], ' <- ')
        this.to = to
        this.byte = to.length === 1
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        if (this.byte) {
            return new Transition().
                withWordRegister(PC, state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, state.getMemoryByte((pcMem[offset] << 8) | pcMem[offset + 1]))
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordRegister(this.to, state.getMemoryWord((pcMem[offset] << 8) | pcMem[offset + 1]))
    }
}

class LoadRegisterToMemory extends Instruction {
    constructor(opcode, from) {
        super(opcode, LOAD, [args.PointerPattern, args.RegisterPattern(from)], ' <- ')
        this.from = from
        this.byte = from.length === 1
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        if (this.byte) {
            return new Transition().
                withWordRegister(PC, state.registers.PC + this.size).
                withByteAt((pcMem[offset] << 8) | pcMem[offset + 1], state.registers[this.from])
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordAt((pcMem[offset] << 8) | pcMem[offset + 1], state.registers[this.from])
    }
}

function operation(target, source) {
    return source
}

export default [
    new RegisterToRegisterInstruction(0xf9, LOAD, SP, HL, operation),
    new RegisterToRegisterInstruction(0xddf9, LOAD, SP, IX, operation),
    new RegisterToRegisterInstruction(0xfdf9, LOAD, SP, IY, operation),
    new LoadRegisterToMemory(0x32, 'A'),
    new LoadRegisterToMemory(0xed43, BC),
    new LoadRegisterToMemory(0xed53, DE),
    new LoadRegisterToMemory(0x22, HL),
    new LoadRegisterToMemory(0xdd22, IX),
    new LoadRegisterToMemory(0xfd22, IY),
    new LoadRegisterToMemory(0x3d73, SP),
    new LoadMemoryToRegister(0x3a, 'A'),
    new LoadMemoryToRegister(0xed4b, BC),
    new LoadMemoryToRegister(0xed5b, DE),
    new LoadMemoryToRegister(0x2a, HL),
    new LoadMemoryToRegister(0xdd2a, IX),
    new LoadMemoryToRegister(0xfd2a, IY),
    new LoadMemoryToRegister(0xed7b, SP),
    new WordValueToRegisterInstruction(0x01, LOAD, BC, operation),
    new WordValueToRegisterInstruction(0x11, LOAD, DE, operation),
    new WordValueToRegisterInstruction(0x21, LOAD, HL, operation),
    new WordValueToRegisterInstruction(0xdd21, LOAD, IX, operation),
    new WordValueToRegisterInstruction(0xfd21, LOAD, IY, operation),
    new WordValueToRegisterInstruction(0x31, LOAD, SP, operation)
].
    concat(... createToRegisterInstructions(0x40, (base, toRegister) =>
        createFromRegisterInstructions(base, (opcode, fromRegister) =>
            new RegisterToRegisterInstruction(opcode, LOAD, toRegister, fromRegister, operation)))).
    concat(createToRegisterInstructions(0x06, (opcode, register) =>
        new ByteValueToRegisterInstruction(opcode, LOAD, register, operation))).
    concat(createToRegisterInstructions(0x46, (opcode, register) =>
        new PointerToRegisterInstruction(opcode, LOAD, register, HL, operation))).
    concat(createToRegisterInstructions(0xdd46, (opcode, register) =>
        new IndexPointerToRegisterInstruction(opcode, LOAD, register, IX, operation))).
    concat(createToRegisterInstructions(0xfd46, (opcode, register) =>
        new IndexPointerToRegisterInstruction(opcode, LOAD, register, IY, operation)))
