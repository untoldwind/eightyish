import GenericInstruction from './GenericInstruction'

import { createToRegisterInstructions } from './factory'

import { REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP, INC } from './constants'

function byteOperation(storer, first) {
    const result = first + 1

    return storer(result).withFlags(result)
}

function wordOperation(storer, first) {
    const result = first + 1

    return storer(result)
}

export default [
    new GenericInstruction(0xdd23, INC, [REG_IX], wordOperation),
    new GenericInstruction(0xfd23, INC, [REG_IY], wordOperation)
].
    concat(createToRegisterInstructions(0x04, (opcode, register) =>
        new GenericInstruction(opcode, INC, [register], byteOperation))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) =>
        new GenericInstruction(0x03 + (i << 4), INC, [register], wordOperation)))
