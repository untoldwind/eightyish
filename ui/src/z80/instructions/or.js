import ByteValueToRegisterInstruction from './ByteValueToRegisterInstruction';
import RegisterToRegisterInstruction from './RegisterToRegisterInstruction';
import PointerToRegisterInstruction from './PointerToRegisterInstruction';
import IndexPointerToRegisterInstruction from './IndexPointerToRegisterInstruction';

function operation(target, source) {
    return target | source;
}

export default [
    new RegisterToRegisterInstruction(0xb0, 'OR', 'A', 'B', operation),
    new RegisterToRegisterInstruction(0xb1, 'OR', 'A', 'C', operation),
    new RegisterToRegisterInstruction(0xb2, 'OR', 'A', 'D', operation),
    new RegisterToRegisterInstruction(0xb3, 'OR', 'A', 'E', operation),
    new PointerToRegisterInstruction(0xb6, 'OR', 'A', 'HL', operation),
    new IndexPointerToRegisterInstruction(0xddb6, 'OR', 'A', 'IX', operation),
    new IndexPointerToRegisterInstruction(0xfdb6, 'OR', 'A', 'IY', operation),
    new ByteValueToRegisterInstruction(0xf6, 'OR', 'A', operation)
];
