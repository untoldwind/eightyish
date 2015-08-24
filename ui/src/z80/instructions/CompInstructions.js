import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import { createFromRegisterInstructions } from './factory'

import { BYTE_VAL, REG_A, POINTER_HL, POINTER_IX, POINTER_IY, COMP } from './constants'

function operation(storer, first, second) {
    const result = first - second

    return new Transition().withFlags(result)
}

export default [
    new GenericInstruction(0xfe, COMP, [REG_A, BYTE_VAL], operation),
    new GenericInstruction(0xbe, COMP, [REG_A, POINTER_HL], operation),
    new GenericInstruction(0xddbe, COMP, [REG_A, POINTER_IX], operation),
    new GenericInstruction(0xfdbe, COMP, [REG_A, POINTER_IY], operation)
].concat(createFromRegisterInstructions(0xb8, (opcode, register) =>
        new GenericInstruction(opcode, COMP, [REG_A, register], operation)))
