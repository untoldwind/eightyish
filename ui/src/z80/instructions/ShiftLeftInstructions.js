import RegisterInstruction from './RegisterInstruction'

import { createFromRegisterInstructions } from './factory'

import { SHL } from './constants'

function operation(register) {
    return register << 1
}

export default [].
    concat(createFromRegisterInstructions(0xcb20, (opcode, register) =>
        new RegisterInstruction(opcode, SHL, register, operation)))
