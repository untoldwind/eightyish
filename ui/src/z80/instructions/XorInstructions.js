import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, XOR } from './constants'

function operation(storer, first, second) {
    const result = first ^ second

    return storer(result).withFlags(result)
}

export default [
    new GenericInstruction(0xae, XOR, [REG_A, POINTER_HL], operation, POINTER_DELIM),
    new GenericInstruction(0xddae, XOR, [REG_A, POINTER_IX], operation, POINTER_DELIM),
    new GenericInstruction(0xfdae, XOR, [REG_A, POINTER_IY], operation, POINTER_DELIM),
    new GenericInstruction(0xee, XOR, [REG_A, BYTE_VAL], operation, POINTER_DELIM)
].concat(createFromRegisterInstructions(0xa8, (opcode, register) =>
        new GenericInstruction(opcode, XOR, [REG_A, register], operation, POINTER_DELIM)))
