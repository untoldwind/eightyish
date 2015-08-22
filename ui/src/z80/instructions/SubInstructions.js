import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

import { createFromRegisterInstructions } from './factory'

import { SUB, HL, IX, IY } from './constants'

function operation(target, source) {
    return target - source
}

export default [
    new PointerToRegisterInstruction(0x96, SUB, 'A', HL, operation),
    new IndexPointerToRegisterInstruction(0xdd96, SUB, 'A', IX, operation),
    new IndexPointerToRegisterInstruction(0xfd96, SUB, 'A', IY, operation),
    new ByteValueToRegisterInstruction(0xd6, SUB, 'A', operation)
].concat(createFromRegisterInstructions(0x90, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, SUB, 'A', register, operation)))
