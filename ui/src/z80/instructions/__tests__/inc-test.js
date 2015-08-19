jest.autoMockOff();

let inc_instructions = require('../inc');
let byOpcode = new Map(inc_instructions.map(i => [i.opcode, i]));

describe('Inc Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(inc_instructions.length)
    });

    it('should support INC A', () => {
        let incA = byOpcode.get(0x3c);

        expect(incA).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 9
            }
        };
        let transition = incA.process(state, [0x3c]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(10);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assembler = incA.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('INC\tA');
        expect(assembler.opcodes(undefined)).toEqual([0x3c]);
        expect(assembler.size).toBe(1)
    });

    it('should support INC BC', () => {
        let incBC = byOpcode.get(0x03);

        expect(incBC).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                BC: 123
            }
        };
        let transition = incBC.process(state, [0x03]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.BC).toBe(124);
        expect(transition.newRegisters.flagC).toBeUndefined();
        expect(transition.newRegisters.flagS).toBeUndefined();
        expect(transition.newRegisters.flagP).toBeUndefined();
        expect(transition.newRegisters.flagZ).toBeUndefined();

        let assembler = incBC.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('INC\tBC');
        expect(assembler.opcodes(undefined)).toEqual([0x03]);
        expect(assembler.size).toBe(1)
    });
});