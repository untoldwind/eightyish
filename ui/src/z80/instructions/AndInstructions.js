import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import {BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, AND } from './constants'

function operation(storer, first, second) {
    const result = first & second

    return storer(result).withFlags(result)
}

function create(opcode, to, from) {
    return new GenericInstruction(opcode, AND, [to, from], operation, POINTER_DELIM)
}

export default [
    create(0xa6, REG_A, POINTER_HL),
    create(0xdda6, REG_A, POINTER_IX),
    create(0xfda6, REG_A, POINTER_IY),
    create(0xe6, REG_A, BYTE_VAL)
].concat(createFromRegisterInstructions(0xa0, (opcode, register) => create(opcode, REG_A, register)))
