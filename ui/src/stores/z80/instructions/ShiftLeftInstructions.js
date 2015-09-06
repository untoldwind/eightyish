import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { SHL, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

function operation(storer, first) {
    const result = first << 1

    return storer(result).withFlags(result).withCarry((first & 0x80) !== 0)
}

function create(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, SHL, [target], operation)
}

export default [
    create(0xcb26, 15, POINTER_HL),
    create(0xddcb26, 23, POINTER_IX),
    create(0xfdcb26, 23, POINTER_IY)
].concat(createFromRegisterInstructions(0xcb20, (opcode, register) => create(opcode, 8, register)))
