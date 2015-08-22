import RegisterInstruction from './RegisterInstruction'

import { createToRegisterInstructions } from './factory'

function operation(register) {
    return register + 1
}

export default [
    new RegisterInstruction(0xdd23, 'INC', 'IX', operation),
    new RegisterInstruction(0xfd23, 'INC', 'IY', operation)
].
    concat(createToRegisterInstructions(0x04, (opcode, register) =>
        new RegisterInstruction(opcode, 'INC', register, operation))).
    concat(['BC', 'DE', 'HL', 'SP'].map((register, i) =>
        new RegisterInstruction(0x03 + (i << 4), 'INC', register, operation)))
