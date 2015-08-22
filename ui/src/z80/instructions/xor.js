import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

import { createFromRegisterInstructions } from './factory'

function operation(target, source) {
    return target ^ source
}

export default [
    new PointerToRegisterInstruction(0xae, 'XOR', 'A', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xddae, 'XOR', 'A', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfdae, 'XOR', 'A', 'IY', operation),
    new ByteValueToRegisterInstruction(0xee, 'XOR', 'A', operation)
].concat(createFromRegisterInstructions(0xa8, (opcode, register) =>
        new RegisterToRegisterInstruction(opcode, 'XOR', 'A', register, operation)))
