import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { ROTLC } from './constants'

function operation(storer, first, flags) {
    const result = (first << 1) | (flags.C ? 0x1 : 0x0)

    return storer(result).withFlags(result)
}

export default [].
    concat(createFromRegisterInstructions(0xcb10, (opcode, register) =>
        new GenericInstruction(opcode, 8, ROTLC, [register], operation)))
