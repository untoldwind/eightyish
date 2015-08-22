import RegisterInstruction from './RegisterInstruction'

import { createToRegisterInstructions } from './factory'

import { DEC, IX, IY, BC, DE, HL, SP } from './constants'

function operation(register) {
    return register - 1
}

export default [
    new RegisterInstruction(0xdd2b, DEC, IX, operation),
    new RegisterInstruction(0xfd2b, DEC, IY, operation)
].
    concat(createToRegisterInstructions(0x05, (opcode, register) =>
        new RegisterInstruction(opcode, DEC, register, operation))).
    concat([BC, DE, HL, SP].map((register, i) =>
        new RegisterInstruction(0x0b + (i << 4), DEC, register, operation)))
