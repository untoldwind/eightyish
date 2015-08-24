import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'


import { createFromRegisterInstructions, createToRegisterInstructions } from './factory'

import { BYTE_VAL, BYTE_POINTER, WORD_VAL, WORD_POINTER,
    LOAD, HL, IX, IY, SP, PC, BC, DE, POINTER_DELIM, REG_A, REG_BC, REG_DE,
    REG_SP, REG_HL, REG_IX, REG_IY, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

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
    new GenericInstruction(0x32, 13, LOAD, [BYTE_POINTER, REG_A], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xed43, 20, LOAD, [WORD_POINTER, REG_BC], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xed53, 20, LOAD, [WORD_POINTER, REG_DE], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x22, 20, LOAD, [WORD_POINTER, REG_HL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd22, 20, LOAD, [WORD_POINTER, REG_IX], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd22, 20, LOAD, [WORD_POINTER, REG_IY], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x3d73, 20, LOAD, [WORD_POINTER, REG_SP], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x3a, 13, LOAD, [REG_A,BYTE_POINTER], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xed4b, 20, LOAD, [REG_BC, WORD_POINTER], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xed5b, 20, LOAD, [REG_DE, WORD_POINTER], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x2a, 20, LOAD, [REG_HL, WORD_POINTER], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd2a, 20, LOAD, [REG_IX, WORD_POINTER], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd2a, 20, LOAD, [REG_IY, WORD_POINTER], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xed7b, 20, LOAD, [REG_SP, WORD_POINTER], wordOperation, POINTER_DELIM),
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
    concat(createFromRegisterInstructions(0x70, (opcode, register) =>
        new GenericInstruction(opcode, 7, LOAD, [POINTER_HL, register], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0xdd46, (opcode, register) =>
        new GenericInstruction(opcode, 19, LOAD, [register, POINTER_IX], byteOperation, POINTER_DELIM))).
    concat(createFromRegisterInstructions(0xdd70, (opcode, register) =>
        new GenericInstruction(opcode, 19, LOAD, [POINTER_IX, register], byteOperation, POINTER_DELIM))).
    concat(createToRegisterInstructions(0xfd46, (opcode, register) =>
        new GenericInstruction(opcode, 19, LOAD, [register, POINTER_IY], byteOperation, POINTER_DELIM))).
    concat(createFromRegisterInstructions(0xfd70, (opcode, register) =>
        new GenericInstruction(opcode, 19, LOAD, [POINTER_IY, register], byteOperation, POINTER_DELIM)))
