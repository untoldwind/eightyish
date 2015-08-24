import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, OR } from './constants'

function operation(storer, first, second) {
    const result = first | second

    return storer(result).withFlags(result)
}

function create(opcode, to, from) {
    return new GenericInstruction(opcode, OR, [to, from], operation, POINTER_DELIM)
}

export default [
    create(0xb6, REG_A, POINTER_HL),
    create(0xddb6, REG_A, POINTER_IX),
    create(0xfdb6, REG_A, POINTER_IY),
    create(0xf6, REG_A, BYTE_VAL)
].concat(createFromRegisterInstructions(0xb0, (opcode, register) => create(opcode, REG_A, register)))
