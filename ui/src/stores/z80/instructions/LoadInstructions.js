import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions, createFromWithPointers, createToRegisterInstructions } from './factory'

import { BYTE_VAL, BYTE_POINTER, WORD_VAL, WORD_POINTER,
    LOAD, POINTER_DELIM, REG_A, REG_BC, REG_DE,
    REG_SP, REG_HL, REG_IX, REG_IY, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

function byteOperation(storer, first, second) {
    return storer(second)
}

function wordOperation(storer, first, second) {
    return storer(second)
}

function createByte(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, LOAD, [to, from], byteOperation, POINTER_DELIM)
}

function createWord(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, LOAD, [to, from], wordOperation, POINTER_DELIM)
}

export const name = LOAD
export const description = 'Load/transfer source to target: LOAD target <- source'
export const instructions = [
    createByte(0xf9, 6, REG_SP, REG_HL),
    createByte(0xddf9, 10, REG_SP, REG_IX),
    createByte(0xfdf9, 10, REG_SP, REG_IY),
    createByte(0x32, 13, BYTE_POINTER, REG_A),
    createWord(0xed43, 20, WORD_POINTER, REG_BC),
    createWord(0xed53, 20, WORD_POINTER, REG_DE),
    createWord(0x22, 20, WORD_POINTER, REG_HL),
    createWord(0xdd22, 20, WORD_POINTER, REG_IX),
    createWord(0xfd22, 20, WORD_POINTER, REG_IY),
    createWord(0x3d73, 20, WORD_POINTER, REG_SP),
    createByte(0x3a, 13, REG_A, BYTE_POINTER),
    createWord(0xed4b, 20, REG_BC, WORD_POINTER),
    createWord(0xed5b, 20, REG_DE, WORD_POINTER),
    createWord(0x2a, 20, REG_HL, WORD_POINTER),
    createWord(0xdd2a, 20, REG_IX, WORD_POINTER),
    createWord(0xfd2a, 20, REG_IY, WORD_POINTER),
    createWord(0xed7b, 20, REG_SP, WORD_POINTER),
    createWord(0x01, 10, REG_BC, WORD_VAL),
    createWord(0x11, 10, REG_DE, WORD_VAL),
    createWord(0x21, 10, REG_HL, WORD_VAL),
    createWord(0xdd21, 14, REG_IX, WORD_VAL),
    createWord(0xfd21, 14, REG_IY, WORD_VAL),
    createWord(0x31, 10, REG_SP, WORD_VAL)
].
    concat(... createToRegisterInstructions(0x40, (base, toRegister) =>
        createFromWithPointers(base, 3, 15, (opcode, fromRegister) =>
            createByte(opcode, 4, toRegister, fromRegister)))).
    concat(createToRegisterInstructions(0x06, (opcode, register) => createByte(opcode, 7, register, BYTE_VAL))).
    concat(createFromRegisterInstructions(0x70, (opcode, register) => createByte(opcode, 7, POINTER_HL, register))).
    concat(createFromRegisterInstructions(0xdd70, (opcode, register) => createByte(opcode, 19, POINTER_IX, register))).
    concat(createFromRegisterInstructions(0xfd70, (opcode, register) => createByte(opcode, 19, POINTER_IY, register)))
