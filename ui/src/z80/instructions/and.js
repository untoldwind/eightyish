import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

import { createFromRegisterInstructions } from './factory'

import { AND, HL, IX, IY } from './constants'

function operation(target, source) {
    return target & source
}

export default [
    new PointerToRegisterInstruction(0xa6, AND, 'A', HL, operation),
    new IndexPointerToRegisterInstruction(0xdda6, AND, 'A', IX, operation),
    new IndexPointerToRegisterInstruction(0xfda6, AND, 'A', IY, operation),
    new ByteValueToRegisterInstruction(0xe6, AND, 'A', operation)
].concat(createFromRegisterInstructions(0xa0, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, AND, 'A', register, operation)))
