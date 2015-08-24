import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { ByteValueArgument } from './Arguments'

import { REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, OR } from './constants'

function operation(storer, first, second) {
    const result = first | second

    return storer(result).withFlags(result)
}

export default [
    new GenericInstruction(0xb6, OR, [REG_A, POINTER_HL], operation, POINTER_DELIM),
    new GenericInstruction(0xddb6, OR, [REG_A, POINTER_IX], operation, POINTER_DELIM),
    new GenericInstruction(0xfdb6, OR, [REG_A, POINTER_IY], operation, POINTER_DELIM),
    new GenericInstruction(0xf6, OR, [REG_A, ByteValueArgument], operation, POINTER_DELIM)
].concat(createFromRegisterInstructions(0xb0, (opcode, register) =>
        new GenericInstruction(opcode, OR, [REG_A, register], operation, POINTER_DELIM)))
