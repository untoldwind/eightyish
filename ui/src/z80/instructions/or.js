import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

import { createFromRegisterInstructions } from './factory'

import { OR, HL, IX, IY } from './constants'

function operation(target, source) {
    return target | source
}

export default [
    new PointerToRegisterInstruction(0xb6, OR, 'A', HL, operation),
    new IndexPointerToRegisterInstruction(0xddb6, OR, 'A', IX, operation),
    new IndexPointerToRegisterInstruction(0xfdb6, OR, 'A', IY, operation),
    new ByteValueToRegisterInstruction(0xf6, OR, 'A', operation)
].concat(createFromRegisterInstructions(0xb0, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, OR, 'A', register, operation)))
