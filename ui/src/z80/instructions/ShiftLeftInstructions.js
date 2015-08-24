import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { SHL } from './constants'

function operation(storer, first) {
    const result = first << 1

    return storer(result).withFlags(result)
}

export default [].
    concat(createFromRegisterInstructions(0xcb20, (opcode, register) =>
        new GenericInstruction(opcode, SHL, [register], operation)))
