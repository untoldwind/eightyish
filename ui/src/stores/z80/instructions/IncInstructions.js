import GenericInstruction from './GenericInstruction'

import { createToWithPointers } from './factory'

import { REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP, INC } from './constants'

function byteOperation(storer, first) {
    const result = first + 1

    return storer(result).withFlags(result)
}

function wordOperation(storer, first) {
    const result = first + 1

    return storer(result)
}

function createByte(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, INC, [target], byteOperation)
}

function createWord(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, INC, [target], wordOperation)
}

export const name = INC
export const description = 'Increments target by 1: INC target'
export const instructions = [
    createWord(0xdd23, 10, REG_IX),
    createWord(0xfd23, 10, REG_IY)
].
    concat(createToWithPointers(0x04, 7, 19, (opcode, register) => createByte(opcode, 4, register))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) => createWord(0x03 + (i << 4), 6, register)))
