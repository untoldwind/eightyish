import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { ROTRC, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

function operation(storer, first, flags) {
    const result = (first >> 1) | (flags.C ? 0x80 : 0x0)

    return storer(result).withFlags(result).withFlag('C', (first & 0x1) !== 0)
}

function create(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, ROTRC, [target], operation)
}

export default [
    create(0xcb1e, 15, POINTER_HL),
    create(0xddcb1e, 23, POINTER_IX),
    create(0xfdcb1e, 23, POINTER_IY)
].concat(createFromRegisterInstructions(0xcb18, (opcode, register) => create(opcode, 8, register)))
