import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP,
    POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, ADD} from './constants'

function byteOperation(storer, first, second) {
    const result = first + second

    return storer(result).withFlags(result)
}

function wordOperation(storer, first, second) {
    const result = first + second

    return storer(result)
}

function createByte(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, ADD, [to, from], byteOperation, POINTER_DELIM)
}

function createWord(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, ADD, [to, from], wordOperation, POINTER_DELIM)
}

export default [
    createByte(0x86, 7, REG_A, POINTER_HL, 7),
    createByte(0xdd86, 19, REG_A, POINTER_IX, 19),
    createByte(0xfd86, 19, REG_A, POINTER_IY, 19),
    createByte(0xc6, 7, REG_A, BYTE_VAL, 7)
].
    concat(createFromRegisterInstructions(0x80, (opcode, register) => createByte(opcode, 4, REG_A, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0x09 + (i << 4), 11, REG_HL, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xdd09 + (i << 4), 15, REG_IX, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xfd09 + (i << 4), 15, REG_IY, register)))
