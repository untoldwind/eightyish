import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction';
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction';
import PointerToRegisterInstruction from './PointerToRegisterInstruction';
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

function operation(target, source) {
    return target + source;
}

export default [
    new RegisterToRegisterInstruction(0x09, 'ADD', 'HL', 'BC', operation),
    new RegisterToRegisterInstruction(0x19, 'ADD', 'HL', 'DE', operation),
    new RegisterToRegisterInstruction(0x29, 'ADD', 'HL', 'HL', operation),
    new RegisterToRegisterInstruction(0x39, 'ADD', 'HL', 'SP', operation),
    new RegisterToRegisterInstruction(0xdd09, 'ADD', 'IX', 'BC', operation),
    new RegisterToRegisterInstruction(0xdd19, 'ADD', 'IX', 'DE', operation),
    new RegisterToRegisterInstruction(0xdd29, 'ADD', 'IX', 'IX', operation),
    new RegisterToRegisterInstruction(0xdd39, 'ADD', 'IX', 'SP', operation),
    new RegisterToRegisterInstruction(0xfd09, 'ADD', 'IY', 'BC', operation),
    new RegisterToRegisterInstruction(0xfd19, 'ADD', 'IY', 'DE', operation),
    new RegisterToRegisterInstruction(0xfd29, 'ADD', 'IY', 'IX', operation),
    new RegisterToRegisterInstruction(0xfd39, 'ADD', 'IY', 'SP', operation),
    new RegisterToRegisterInstruction(0x80, 'ADD', 'A', 'B', operation),
    new RegisterToRegisterInstruction(0x81, 'ADD', 'A', 'C', operation),
    new RegisterToRegisterInstruction(0x82, 'ADD', 'A', 'D', operation),
    new RegisterToRegisterInstruction(0x83, 'ADD', 'A', 'E', operation),
    new PointerToRegisterInstruction(0x86, 'ADD', 'A', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdd86, 'ADD', 'A', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfd86, 'ADD', 'A', 'IY', operation),
    new ByteValueToRegisterInstruction(0xc6, 'ADD', 'A', operation)
]
