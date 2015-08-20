jest.autoMockOff();

const IncInstructions = require('../inc');
const byOpcode = new Map(IncInstructions.map(i => [i.opcode, i]));

describe('Inc Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(IncInstructions.length);
    });

    it('should support INC A', () => {
        const incA = byOpcode.get(0x3c);

        expect(incA).toBeDefined();

        const state = {
            registers: {
                PC: 1234,
                A: 9
            }
        };
        const transition = incA.process(state, [0x3c]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(10);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        const assembler = incA.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('INC\tA');
        expect(assembler.opcodes(null)).toEqual([0x3c]);
        expect(assembler.size).toBe(1);
    });

    it('should support INC BC', () => {
        const incBC = byOpcode.get(0x03);

        expect(incBC).toBeDefined();

        const state = {
            registers: {
                PC: 1234,
                BC: 123
            }
        };
        const transition = incBC.process(state, [0x03]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.BC).toBe(124);
        expect(transition.newRegisters.flagC).toBeUndefined();
        expect(transition.newRegisters.flagS).toBeUndefined();
        expect(transition.newRegisters.flagP).toBeUndefined();
        expect(transition.newRegisters.flagZ).toBeUndefined();

        const assembler = incBC.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('INC\tBC');
        expect(assembler.opcodes(null)).toEqual([0x03]);
        expect(assembler.size).toBe(1);
    });
});
