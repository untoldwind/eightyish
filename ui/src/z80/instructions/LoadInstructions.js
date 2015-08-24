import GenericInstruction from './GenericInstruction'

import Instruction from './Instruction'
import Transition from '../Transition'

import { RegisterArgument, ByteValueArgument, PointerPattern, AddressOrLabelArgument } from './Arguments'

import { createFromRegisterInstructions, createToRegisterInstructions } from './factory'

import { LOAD, HL, IX, IY, SP, PC, BC, DE, POINTER_DELIM, REG_BC, REG_DE,
    REG_SP, REG_HL, REG_IX, REG_IY, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

class LoadMemoryToRegister extends Instruction {
    constructor(opcode, to) {
        super(opcode, LOAD, [RegisterArgument(to), PointerPattern], POINTER_DELIM)
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
        super(opcode, LOAD, [PointerPattern, RegisterArgument(from)], POINTER_DELIM)
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

function byteOperation(storer, first, second) {
    return storer(second).withFlags(second)
}

function wordOperation(storer, first, second) {
    return storer(second)
}

export default [
    new GenericInstruction(0xf9, LOAD, [REG_SP, REG_HL], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xddf9, LOAD, [REG_SP, REG_IX], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xfdf9, LOAD, [REG_SP, REG_IY], byteOperation, POINTER_DELIM),
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
    new GenericInstruction(0x01, LOAD, [REG_BC, AddressOrLabelArgument], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x11, LOAD, [REG_DE, AddressOrLabelArgument], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x21, LOAD, [REG_HL, AddressOrLabelArgument], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd21, LOAD, [REG_IX, AddressOrLabelArgument], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd21, LOAD, [REG_IY, AddressOrLabelArgument], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x31, LOAD, [REG_SP, AddressOrLabelArgument], wordOperation, POINTER_DELIM)
].
    concat(... createToRegisterInstructions(0x40, (base, toRegister) =>
        createFromRegisterInstructions(base, (opcode, fromRegister) =>
            new GenericInstruction(opcode, LOAD, [toRegister, fromRegister], byteOperation, POINTER_DELIM)))).
    concat(createToRegisterInstructions(0x06, (opcode, register) =>
        new GenericInstruction(opcode, LOAD, [register, ByteValueArgument], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0x46, (opcode, register) =>
        new GenericInstruction(opcode, LOAD, [register, POINTER_HL], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0xdd46, (opcode, register) =>
        new GenericInstruction(opcode, LOAD, [register, POINTER_IX], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0xfd46, (opcode, register) =>
        new GenericInstruction(opcode, LOAD, [register, POINTER_IY], byteOperation, POINTER_DELIM)))
