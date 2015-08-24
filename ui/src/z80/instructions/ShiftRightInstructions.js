import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { SHR } from './constants'

function operation(storer, first) {
    const result = first >> 1

    return storer(result).withFlags(result).withFlag('C', (first & 0x1) !== 0)
}

export default [].
    concat(createFromRegisterInstructions(0xcb38, (opcode, register) =>
        new GenericInstruction(opcode, 8, SHR, [register], operation)))
