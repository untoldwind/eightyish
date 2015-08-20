jest.autoMockOff();

const CompInstructions = require('../comp');
const byOpcode = new Map(CompInstructions.map(i => [i.opcode, i]));

describe('Compate Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(CompInstructions.length);
    });
});
