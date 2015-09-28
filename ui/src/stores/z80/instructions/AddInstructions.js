import GenericInstruction from './GenericInstruction'

import { createFromWithPointers } from './factory'

import { BYTE_VAL, REG_A, REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP,
    POINTER_DELIM, ADD} from './constants'

function byteOperation(storer, first, second) {
    const result = first + second

    return storer(result).withFlags(result).withCarry((result & 0x100) !== 0)
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

export const name = ADD
export const description = 'Adds source to target: ADD target <- source'
export const instructions = [
    createByte(0xc6, 7, REG_A, BYTE_VAL)
].
    concat(createFromWithPointers(0x80, 3, 15, (opcode, register) => createByte(opcode, 4, REG_A, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0x09 + (i << 4), 11, REG_HL, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xdd09 + (i << 4), 15, REG_IX, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xfd09 + (i << 4), 15, REG_IY, register)))

export default []
