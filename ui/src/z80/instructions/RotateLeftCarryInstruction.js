import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { ROTLC, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

function operation(storer, first, flags) {
    const result = (first << 1) | (flags.C ? 0x1 : 0x0)

    return storer(result).withFlags(result)
}

function create(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, ROTLC, [target], operation)
}

export default [
    create(0xcb16, 15, POINTER_HL),
    create(0xddcb16, 23, POINTER_IX),
    create(0xfdcb16, 23, POINTER_IY)
].concat(createFromRegisterInstructions(0xcb10, (opcode, register) => create(opcode, 8, register)))
