jest.autoMockOff();

let add_instructions = require('../add');
let byOpcode = new Map(add_instructions.map(i => [i.opcode, i]));

describe('Add Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(add_instructions.length)
    });

    it('should support ADD A, B', () => {
        let addAB = byOpcode.get(0x80);

        expect(addAB).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 10,
                B: 5
            }
        };
        let transition = addAB.process(state, [0x80]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(15);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assembler = addAB.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('ADD\tA <- B');
        expect(assembler.opcodes(undefined)).toEqual([0x80]);
        expect(assembler.size).toBe(1)
    });

    it('should support ADD A, 10', () => {
        let addA = byOpcode.get(0xc6);

        expect(addA).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 10
            }
        };
        let transition = addA.process(state, [0xc6, 0x0a]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1236);
        expect(transition.newRegisters.A).toBe(20);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assembler = addA.createAssembler('A', '10');

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('ADD\tA <- 10');
        expect(assembler.opcodes(undefined)).toEqual([0xc6, 0x0a]);
        expect(assembler.size).toBe(2)
    });

    it('should support ADD A, (HL)', () => {
        let addAHL = byOpcode.get(0x86);

        expect(addAHL).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 10,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(5)
        };
        let transition = addAHL.process(state, [0x86]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(15);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(1234);

        let assembler = addAHL.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('ADD\tA <- (HL)');
        expect(assembler.opcodes(undefined)).toEqual([0x86]);
        expect(assembler.size).toBe(1)
    });

    it('should support ADD A, (IX+d)', () => {
        let addAIX = byOpcode.get(0xdd86);

        expect(addAIX).toBeDefined();
        let state = {
            registers: {
                PC: 1234,
                A: 10,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(5)
        };

        let transition = addAIX.process(state, [0xdd, 0x86, 0x0a]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1237);
        expect(transition.newRegisters.A).toBe(15);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(1244);

        let assembler = addAIX.createAssembler('A', '(IX+10)');

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('ADD\tA <- (IX+10)');
        expect(assembler.opcodes(undefined)).toEqual([0xdd, 0x86, 0x0a]);
        expect(assembler.size).toBe(3)
    });

    it('should support word register adding', () => {
        let addHLBC = byOpcode.get(0x09);

        expect(addHLBC).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                HL: 123,
                BC: 234
            }
        };
        let transition = addHLBC.process(state, [0x09]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.HL).toBe(357);
        expect(transition.newRegisters.flagC).toBeUndefined();
        expect(transition.newRegisters.flagS).toBeUndefined();
        expect(transition.newRegisters.flagP).toBeUndefined();
        expect(transition.newRegisters.flagZ).toBeUndefined();

        let assembler = addHLBC.createAssembler('HL', 'BC');

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('ADD\tHL <- BC');
        expect(assembler.size).toBe(1)
    });
});
