import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, COMP } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return new Transition().withFlags(result)
}

function create(opcode, cycles, to, from) {
    return new GenericInstruction(opcode, cycles, COMP, [to, from], operation)
}

export default [
    create(0xfe, 7, REG_A, BYTE_VAL),
    create(0xbe, 7, REG_A, POINTER_HL),
    create(0xddbe, 19, REG_A, POINTER_IX),
    create(0xfdbe, 19, REG_A, POINTER_IY)
].concat(createFromRegisterInstructions(0xb8, (opcode, register) => create(opcode, 4, REG_A, register)))
