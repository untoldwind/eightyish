import GenericInstruction from './GenericInstruction'

import { createToWithPointers } from './factory'

import { REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP, DEC } from './constants'

function byteOperation(storer, first) {
    const result = first - 1

    return storer(result).withFlags(result)
}

function wordOperation(storer, first) {
    const result = first - 1

    return storer(result)
}

function createByte(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, DEC, [target], byteOperation)
}

function createWord(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, DEC, [target], wordOperation)
}

export const instructions = [
    createWord(0xdd2b, 10, REG_IX),
    createWord(0xfd2b, 10, REG_IY)
].
    concat(createToWithPointers(0x05, 7, 19, (opcode, register) => createByte(opcode, 4, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0x0b + (i << 4), 6, register)))
