import RegisterInstruction from './RegisterInstruction';

function operation(register) {
    return register - 1
}

export default [
    new RegisterInstruction(0x3d, 'DEC', 'A', operation),
    new RegisterInstruction(0x0b, 'DEC', 'BC', operation),
    new RegisterInstruction(0x05, 'DEC', 'B', operation),
    new RegisterInstruction(0x1b, 'DEC', 'DE', operation),
    new RegisterInstruction(0x0d, 'DEC', 'C', operation),
    new RegisterInstruction(0x15, 'DEC', 'D', operation),
    new RegisterInstruction(0x1d, 'DEC', 'E', operation),
    new RegisterInstruction(0x2b, 'DEC', 'HL', operation),
    new RegisterInstruction(0xdd2b, 'DEC', 'IX', operation),
    new RegisterInstruction(0xfd2b, 'DEC', 'IY', operation),
    new RegisterInstruction(0x3b, 'DEC', 'SP', operation)
];