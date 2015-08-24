import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, XOR } from './constants'

function operation(storer, first, second) {
    const result = first ^ second

    return storer(result).withFlags(result)
}

function create(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, XOR, [to, from], operation, POINTER_DELIM)
}

export default [
    create(0xae, 7, REG_A, POINTER_HL),
    create(0xddae, 19, REG_A, POINTER_IX),
    create(0xfdae, 19, REG_A, POINTER_IY),
    create(0xee, 7, REG_A, BYTE_VAL)
].concat(createFromRegisterInstructions(0xa8, (opcode, register) => create(opcode, 4, REG_A, register)))
