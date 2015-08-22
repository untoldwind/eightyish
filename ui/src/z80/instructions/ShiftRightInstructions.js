import RegisterInstruction from './RegisterInstruction'

import { createFromRegisterInstructions } from './factory'

import { SHR } from './constants'

function operation(register) {
    return register >> 1
}

export default [].
    concat(createFromRegisterInstructions(0xcb38, (opcode, register) =>
        new RegisterInstruction(opcode, SHR, register, operation)))
