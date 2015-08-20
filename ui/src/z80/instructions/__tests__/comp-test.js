jest.autoMockOff();

const comp_instructions = require('../comp');
const byOpcode = new Map(comp_instructions.map(i => [i.opcode, i]));

describe('Compate Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(comp_instructions.length);
    });
});