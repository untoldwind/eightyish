import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, COMP } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return new Transition().withFlags(result)
}

function create(opcode, to, from) {
    return new GenericInstruction(opcode, COMP, [to, from], operation)
}

export default [
    create(0xfe, REG_A, BYTE_VAL),
    create(0xbe, REG_A, POINTER_HL),
    create(0xddbe, REG_A, POINTER_IX),
    create(0xfdbe, REG_A, POINTER_IY)
].concat(createFromRegisterInstructions(0xb8, (opcode, register) => create(opcode, REG_A, register)))
