import GenericInstruction from './GenericInstruction'

import { createFromWithPointers } from './factory'

import { BYTE_VAL, REG_A, REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP,
    POINTER_DELIM, SUBC} from './constants'

function byteOperation(storer, first, second, carry) {
    const result = first - second - (carry ? 1 : 0)

    return storer(result).withFlags(result).withCarry(result < 0)
}

function wordOperation(storer, first, second, carry) {
    const result = first - second - (carry ? 1 : 0)

    return storer(result).withFlags(result).withCarry(result < 0)
}

function createByte(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, SUBC, [to, from], byteOperation, POINTER_DELIM)
}

function createWord(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, SUBC, [to, from], wordOperation, POINTER_DELIM)
}

export const name = SUBC
export const description = 'Subtract source from target with carry: SUBC target <- source'
export const instructions = [
    createByte(0xde, 7, REG_A, BYTE_VAL)
].
    concat(createFromWithPointers(0x98, 3, 15, (opcode, register) => createByte(opcode, 4, REG_A, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xed42 + (i << 4), 15, REG_HL, register)))
