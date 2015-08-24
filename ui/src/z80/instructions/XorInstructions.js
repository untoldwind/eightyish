import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, XOR } from './constants'

function operation(storer, first, second) {
    const result = first ^ second

    return storer(result).withFlags(result)
}

function create(opcode, to, from) {
    return new GenericInstruction(opcode, XOR, [to, from], operation, POINTER_DELIM)
}

export default [
    create(0xae, REG_A, POINTER_HL),
    create(0xddae, REG_A, POINTER_IX),
    create(0xfdae, REG_A, POINTER_IY),
    create(0xee, REG_A, BYTE_VAL)
].concat(createFromRegisterInstructions(0xa8, (opcode, register) => create(opcode, REG_A, register)))
