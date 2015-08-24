import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, SUB } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return storer(result).withFlags(result).withFlag('C', result < 0)
}

export default [
    new GenericInstruction(0x96, 7, SUB, [REG_A, POINTER_HL], operation, POINTER_DELIM),
    new GenericInstruction(0xdd96, 19, SUB, [REG_A, POINTER_IX], operation, POINTER_DELIM),
    new GenericInstruction(0xfd96, 19, SUB, [REG_A, POINTER_IY], operation, POINTER_DELIM),
    new GenericInstruction(0xd6, 7, SUB, [REG_A, BYTE_VAL], operation, POINTER_DELIM)
].concat(createFromRegisterInstructions(0x90, (opcode, register) =>
        new GenericInstruction(opcode, 4, SUB, [REG_A, register], operation, POINTER_DELIM)))
