jest.autoMockOff();

let and_instructions = require('../and');
let byOpcode = new Map(and_instructions.map(i => [i.opcode, i]));

describe('And Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(and_instructions.length)
    });

    it('should support AND A, B', () => {
        let andAB = byOpcode.get(0xa0);

        expect(andAB).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                B: 0x87
            }
        };
        let transition = andAB.process(state, [0xa0]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assembler = andAB.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('AND\tA <- B');
        expect(assembler.opcodes(undefined)).toEqual([0xa0]);
        expect(assembler.size).toBe(1)
    });

    it('should support AND A, 135', () => {
        let andA = byOpcode.get(0xe6);

        expect(andA).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 0xaa
            }
        };
        let transition = andA.process(state, [0xc6, 0x87]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1236);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assembler = andA.createAssembler('A', '135');

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('AND\tA <- 135');
        expect(assembler.opcodes(undefined)).toEqual([0xe6, 0x87]);
        expect(assembler.size).toBe(2)
    });

    it('should support AND A, (HL)', () => {
        let andAHL = byOpcode.get(0xa6);

        expect(andAHL).toBeDefined();

        let state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x87)
        };
        let transition = andAHL.process(state, [0xa6]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(1234);

        let assembler = andAHL.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('AND\tA <- (HL)');
        expect(assembler.opcodes(undefined)).toEqual([0xa6]);
        expect(assembler.size).toBe(1)
    });

    it('should support AND A, (IX+d)', () => {
        let andAIX = byOpcode.get(0xdda6);

        expect(andAIX).toBeDefined();
        let state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x87)
        };

        let transition = andAIX.process(state, [0xdd, 0xa6, 0x0a]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1237);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(1244);

        let assembler = andAIX.createAssembler('A', '(IX+10)');

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('AND\tA <- (IX+10)');
        expect(assembler.opcodes(undefined)).toEqual([0xdd, 0xa6, 0x0a]);
        expect(assembler.size).toBe(3)
    });
});
