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

function createByte(opcode, to, from) {
    return new GenericInstruction(opcode, ADD, [to, from], byteOperation, POINTER_DELIM)
}

function createWord(opcode, to, from) {
    return new GenericInstruction(opcode, ADD, [to, from], wordOperation, POINTER_DELIM)
}

export default [
    createByte(0x86, REG_A, POINTER_HL),
    createByte(0xdd86, REG_A, POINTER_IX),
    createByte(0xfd86, REG_A, POINTER_IY),
    createByte(0xc6, REG_A, BYTE_VAL)
].
    concat(createFromRegisterInstructions(0x80, (opcode, register) => createByte(opcode, REG_A, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0x09 + (i << 4), REG_HL, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xdd09 + (i << 4), REG_IX, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xfd09 + (i << 4), REG_IX, register)))
