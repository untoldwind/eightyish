import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { ROTRC } from './constants'

function operation(storer, first, flags) {
    const result = (first >> 1) | (flags.C ? 0x80 : 0x0)

    return storer(result).withFlags(result).withFlag('C', (first & 0x1) != 0)
}

export default [].
    concat(createFromRegisterInstructions(0xcb18, (opcode, register) =>
        new GenericInstruction(opcode, 8, ROTRC, [register], operation)))
