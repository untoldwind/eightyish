import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction';
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction';
import PointerToRegisterInstruction from './PointerToRegisterInstruction';
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction'

function operation(target, source) {
    return target & source;
}

export default [
    new RegisterToRegisterInstruction(0xa0, 'AND', 'A', 'B', operation),
    new RegisterToRegisterInstruction(0xa1, 'AND', 'A', 'C', operation),
    new RegisterToRegisterInstruction(0xa2, 'AND', 'A', 'D', operation),
    new RegisterToRegisterInstruction(0xa3, 'AND', 'A', 'E', operation),
    new PointerToRegisterInstruction(0xa6, 'AND', 'A', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xdda6, 'AND', 'A', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfda6, 'AND', 'A', 'IY', operation),
    new ByteValueToRegisterInstruction(0xe6, 'AND', 'A', operation)
]
