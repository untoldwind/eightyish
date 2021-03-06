import GenericInstruction from './GenericInstruction'

import { createFromWithPointers } from './factory'

import { BYTE_VAL, REG_A, POINTER_DELIM, SUB } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return storer(result).withFlags(result).withCarry(result < 0)
}

export const name = SUB
export const description = 'Subtract source from target: SUB target <- source'
export const instructions = [
    new GenericInstruction(0xd6, 7, SUB, [REG_A, BYTE_VAL], operation, POINTER_DELIM)
].concat(createFromWithPointers(0x90, 3, 15, (opcode, register) =>
        new GenericInstruction(opcode, 4, SUB, [REG_A, register], operation, POINTER_DELIM)))
