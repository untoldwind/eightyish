import GenericInstruction from './GenericInstruction'

import { createFromWithPointers } from './factory'

import { BYTE_VAL, REG_A, REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP,
    POINTER_DELIM, ADDC} from './constants'

function byteOperation(storer, first, second, carry) {
    const result = first + second + (carry ? 1 : 0)

    return storer(result).withFlags(result).withCarry((result & 0x100) !== 0)
}

function wordOperation(storer, first, second, carry) {
    const result = first + second + (carry ? 1 : 0)

    return storer(result)
}

function createByte(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, ADDC, [to, from], byteOperation, POINTER_DELIM)
}

function createWord(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, ADDC, [to, from], wordOperation, POINTER_DELIM)
}

export const name = ADDC
export const description = 'Adds source to target with carry: ADDC target <- source'
export const instructions = [
    createByte(0xce, 7, REG_A, BYTE_VAL)
].
    concat(createFromWithPointers(0x88, 3, 15, (opcode, register) => createByte(opcode, 4, REG_A, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0xed4a + (i << 4), 15, REG_HL, register)))
