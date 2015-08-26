import GenericInstruction from './GenericInstruction'

import { createFromWithPointers } from './factory'

import {BYTE_VAL, REG_A, POINTER_DELIM, AND } from './constants'

function operation(storer, first, second) {
    const result = first & second

    return storer(result).withFlags(result)
}

function create(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, AND, [to, from], operation, POINTER_DELIM)
}

export default [
    create(0xe6, 7, REG_A, BYTE_VAL)
].concat(createFromWithPointers(0xa0, (opcode, register) => create(opcode, 4, REG_A, register)))
