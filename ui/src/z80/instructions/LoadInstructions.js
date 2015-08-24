import GenericInstruction from './GenericInstruction'

import Instruction from './Instruction'
import Transition from '../Transition'

import RegisterArgument from '../arguments/RegisterArgument'
import BytePointerArgument from '../arguments/BytePointerArgument'

import { createFromRegisterInstructions, createToRegisterInstructions } from './factory'

import { BYTE_VAL, WORD_VAL, LOAD, HL, IX, IY, SP, PC, BC, DE, POINTER_DELIM, REG_BC, REG_DE,
    REG_SP, REG_HL, REG_IX, REG_IY, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

class LoadMemoryToRegister extends Instruction {
    constructor(opcode, cycles, to) {
        super(opcode, cycles, LOAD, [RegisterArgument(to), BytePointerArgument], POINTER_DELIM)
        this.to = to
        this.byte = to.length === 1
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        if (this.byte) {
            return new Transition().
                withWordRegister(PC, state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, state.getMemoryByte((pcMem[offset] << 8) | pcMem[offset + 1])).
                withCycles(this.cycles)
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordRegister(this.to, state.getMemoryWord((pcMem[offset] << 8) | pcMem[offset + 1])).
            withCycles(this.cycles)
    }
}

class LoadRegisterToMemory extends Instruction {
    constructor(opcode, cycles, from) {
        super(opcode, cycles, LOAD, [BytePointerArgument, RegisterArgument(from)], POINTER_DELIM)
        this.from = from
        this.byte = from.length === 1
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        if (this.byte) {
            return new Transition().
                withWordRegister(PC, state.registers.PC + this.size).
                withByteAt((pcMem[offset] << 8) | pcMem[offset + 1], state.registers[this.from]).
                withCycles(this.cycles)
        }
        return new Transition().
            withWordRegister(PC, state.registers.PC + this.size).
            withWordAt((pcMem[offset] << 8) | pcMem[offset + 1], state.registers[this.from]).
            withCycles(this.cycles)
    }
}

function byteOperation(storer, first, second) {
    return storer(second).withFlags(second)
}

function wordOperation(storer, first, second) {
    return storer(second)
}

export default [
    new GenericInstruction(0xf9, 6, LOAD, [REG_SP, REG_HL], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xddf9, 10, LOAD, [REG_SP, REG_IX], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xfdf9, 10, LOAD, [REG_SP, REG_IY], byteOperation, POINTER_DELIM),
    new LoadRegisterToMemory(0x32, 13, 'A'),
    new LoadRegisterToMemory(0xed43, 20, BC),
    new LoadRegisterToMemory(0xed53, 20, DE),
    new LoadRegisterToMemory(0x22, 20, HL),
    new LoadRegisterToMemory(0xdd22, 20, IX),
    new LoadRegisterToMemory(0xfd22, 20, IY),
    new LoadRegisterToMemory(0x3d73, 20, SP),
    new LoadMemoryToRegister(0x3a, 13, 'A'),
    new LoadMemoryToRegister(0xed4b, 20, BC),
    new LoadMemoryToRegister(0xed5b, 20, DE),
    new LoadMemoryToRegister(0x2a, 20, HL),
    new LoadMemoryToRegister(0xdd2a, 20, IX),
    new LoadMemoryToRegister(0xfd2a, 20, IY),
    new LoadMemoryToRegister(0xed7b, 20, SP),
    new GenericInstruction(0x01, 10, LOAD, [REG_BC, WORD_VAL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x11, 10, LOAD, [REG_DE, WORD_VAL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x21, 10, LOAD, [REG_HL, WORD_VAL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd21, 14, LOAD, [REG_IX, WORD_VAL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd21, 14, LOAD, [REG_IY, WORD_VAL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x31, 10, LOAD, [REG_SP, WORD_VAL], wordOperation, POINTER_DELIM)
].
    concat(... createToRegisterInstructions(0x40, (base, toRegister) =>
        createFromRegisterInstructions(base, (opcode, fromRegister) =>
            new GenericInstruction(opcode, 4, LOAD, [toRegister, fromRegister], byteOperation, POINTER_DELIM)))).
    concat(createToRegisterInstructions(0x06, (opcode, register) =>
        new GenericInstruction(opcode, 7, LOAD, [register, BYTE_VAL], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0x46, (opcode, register) =>
        new GenericInstruction(opcode, 7, LOAD, [register, POINTER_HL], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0xdd46, (opcode, register) =>
        new GenericInstruction(opcode, 19, LOAD, [register, POINTER_IX], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0xfd46, (opcode, register) =>
        new GenericInstruction(opcode, 19, LOAD, [register, POINTER_IY], byteOperation, POINTER_DELIM)))
