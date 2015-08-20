import RegisterInstruction from './RegisterInstruction';

function operation(register) {
    return register + 1;
}

export default [
    new RegisterInstruction(0x3c, 'INC', 'A', operation),
    new RegisterInstruction(0x03, 'INC', 'BC', operation),
    new RegisterInstruction(0x04, 'INC', 'B', operation),
    new RegisterInstruction(0x13, 'INC', 'DE', operation),
    new RegisterInstruction(0x0c, 'INC', 'C', operation),
    new RegisterInstruction(0x14, 'INC', 'D', operation),
    new RegisterInstruction(0x1c, 'INC', 'E', operation),
    new RegisterInstruction(0x23, 'INC', 'HL', operation),
    new RegisterInstruction(0xdd23, 'INC', 'IX', operation),
    new RegisterInstruction(0xfd23, 'INC', 'IY', operation),
    new RegisterInstruction(0x33, 'INC', 'SP', operation)
];