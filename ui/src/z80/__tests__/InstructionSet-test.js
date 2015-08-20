jest.autoMockOff();

const InstructionSet = require('../InstructionSet');

describe('InstructionSet', () => {
    it('should not have duplicate opcodes', () => {
        const byOpcode = new Map(InstructionSet.INSTRUCTIONS.map(i => [i.opcode, i]));

        expect(byOpcode.size).toBe(InstructionSet.INSTRUCTIONS.length);
    });

    it('should support blank assembler lines', () => {
        const blank = InstructionSet.createBlank();

        expect(blank).toBeDefined();
        expect(blank.type).toBe('blank');
        expect(blank.assembler).toBe('  ');
        expect(blank.opcodes(undefined)).toEqual([]);
        expect(blank.size).toBe(0);
    });

    it('should support error assembler lines', () => {
        const error = InstructionSet.createError('error');

        expect(error).toBeDefined();
        expect(error.type).toBe('error');
    });
});