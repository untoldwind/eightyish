jest.autoMockOff();

let core_instructions = require('../core');
let byOpcode = new Map(core_instructions.map(i => [i.opcode, i]));

describe('Core Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(core_instructions.length)
    });

    it('should support NOP', () => {
        let nop = byOpcode.get(0x0);

        expect(nop).toBeDefined();

        let state = {
            registers: {
                PC: 1234
            }
        };
        let transition = nop.process(state, [0x0]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);

        let assembler = nop.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('NOP');
        expect(assembler.opcodes(undefined)).toEqual([0x0]);
        expect(assembler.size).toBe(1)
    });

    it('should support HALT', () => {
        let nop = byOpcode.get(0x76);

        expect(nop).toBeDefined();

        let state = {};
        let transition = nop.process(state, [0x76]);

        expect(transition).toBeUndefined();

        let assembler = nop.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('HALT');
        expect(assembler.opcodes(undefined)).toEqual([0x76]);
        expect(assembler.size).toBe(1)
    });
});