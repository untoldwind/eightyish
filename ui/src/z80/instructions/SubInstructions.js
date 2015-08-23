import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions2 } from './factory'

import { ByteValueArgument } from './Arguments'

import { REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, SUB } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return storer(result).withFlags(result)
}

export default [
    new GenericInstruction(0x96, SUB, [REG_A, POINTER_HL], operation, POINTER_DELIM),
    new GenericInstruction(0xdd96, SUB, [REG_A, POINTER_IX], operation, POINTER_DELIM),
    new GenericInstruction(0xfd96, SUB, [REG_A, POINTER_IY], operation, POINTER_DELIM),
    new GenericInstruction(0xd6, SUB, [REG_A, ByteValueArgument], operation, POINTER_DELIM)
].concat(createFromRegisterInstructions2(0x90, (opcode, register) =>
        new GenericInstruction(opcode, SUB, [REG_A, register], operation, POINTER_DELIM)))
