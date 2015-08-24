import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import {BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, AND } from './constants'

function operation(storer, first, second) {
    const result = first & second

    return storer(result).withFlags(result)
}

export default [
    new GenericInstruction(0xa6, AND, [REG_A, POINTER_HL], operation, POINTER_DELIM),
    new GenericInstruction(0xdda6, AND, [REG_A, POINTER_IX], operation, POINTER_DELIM),
    new GenericInstruction(0xfda6, AND, [REG_A, POINTER_IY], operation, POINTER_DELIM),
    new GenericInstruction(0xe6, AND, [REG_A, BYTE_VAL], operation, POINTER_DELIM)
].concat(createFromRegisterInstructions(0xa0, (opcode, register) =>
        new GenericInstruction(opcode, AND, [REG_A, register], operation, POINTER_DELIM)))
