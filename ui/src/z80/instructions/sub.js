import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction'
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction'
import PointerToRegisterInstruction from './PointerToRegisterInstruction'
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

function operation(target, source) {
    return target - source
}

export default [
    new RegisterToRegisterInstruction(0x90, 'SUB', 'A', 'B', operation),
    new RegisterToRegisterInstruction(0x91, 'SUB', 'A', 'C', operation),
    new RegisterToRegisterInstruction(0x92, 'SUB', 'A', 'D', operation),
    new RegisterToRegisterInstruction(0x93, 'SUB', 'A', 'E', operation),
    new PointerToRegisterInstruction(0x96, 'SUB', 'A', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd96, 'SUB', 'A', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd96, 'SUB', 'A', 'IY', operation),
    new ByteValueToRegisterInstruction(0xd6, 'SUB', 'A', operation)
]
