import GenericInstruction from './GenericInstruction'

import { createToRegisterInstructions } from './factory'

import { REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP, DEC } from './constants'

function byteOperation(storer, first) {
    const result = first - 1

    return storer(result).withFlags(result)
}

function wordOperation(storer, first) {
    const result = first - 1

    return storer(result)
}

export default [
    new GenericInstruction(0xdd2b, DEC, [REG_IX], wordOperation),
    new GenericInstruction(0xfd2b, DEC, [REG_IY], wordOperation)
].
    concat(createToRegisterInstructions(0x05, (opcode, register) =>
        new GenericInstruction(opcode, DEC, [register], byteOperation))).
    concat([REG_BC, REG_DE, REG_HL, REG_SP].map((register, i) =>
        new GenericInstruction(0x0b + (i << 4), DEC, [register], wordOperation)))
