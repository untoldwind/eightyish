import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import { createFromWithPointers } from './factory'

import { BYTE_VAL, REG_A, COMP } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return new Transition().withFlags(result)
}

function create(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, COMP, [to, from], operation)
}

export default [
    create(0xfe, 7, REG_A, BYTE_VAL)
].concat(createFromWithPointers(0xb8, 3, 15, (opcode, register) => create(opcode, 4, REG_A, register)))
