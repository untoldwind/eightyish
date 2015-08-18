jest.autoMockOff();

let and_instructions = require('../and');
let byOpcode = new Map(and_instructions.map(i => [i.opcode, i]));

describe('And Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(and_instructions.length)
    });

    it('should support AND A, B', () => {
        let andAB = byOpcode.get(0xa0);

        expect(andAB).not.toBeUndefined();

        let state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                B: 0x87
            }
        };
        let transition = andAB.process(state, [0xa0]);

        expect(transition).not.toBeUndefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assember = andAB.createAssembler();

        expect(assember).not.toBeUndefined();
        expect(assember.type).toBe('instruction');
        expect(assember.assembler).toBe('AND\tA <- B');
        expect(assember.opcodes(undefined)).toEqual([0xa0]);
        expect(assember.size).toBe(1)
    });

    it('should support AND A, 135', () => {
        let andA = byOpcode.get(0xe6);

        expect(andA).not.toBeUndefined();

        let state = {
            registers: {
                PC: 1234,
                A: 0xaa
            }
        };
        let transition = andA.process(state, [0xc6, 0x87]);

        expect(transition).not.toBeUndefined();
        expect(transition.newRegisters.PC).toBe(1236);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        let assember = andA.createAssembler('A', '135');

        expect(assember).not.toBeUndefined();
        expect(assember.type).toBe('instruction');
        expect(assember.assembler).toBe('AND\tA <- 135');
        expect(assember.opcodes(undefined)).toEqual([0xe6, 0x87]);
        expect(assember.size).toBe(2)
    });

    it('should support AND A, (HL)', () => {
        let andAHL = byOpcode.get(0xa6);

        expect(andAHL).not.toBeUndefined();

        let state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x87)
        };
        let transition = andAHL.process(state, [0xa6]);

        expect(transition).not.toBeUndefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(1234);

        let assember = andAHL.createAssembler();

        expect(assember).not.toBeUndefined();
        expect(assember.type).toBe('instruction');
        expect(assember.assembler).toBe('AND\tA <- (HL)');
        expect(assember.opcodes(undefined)).toEqual([0xa6]);
        expect(assember.size).toBe(1)
    });

    it('should support AND A, (IX+d)', () => {
        let andAIX = byOpcode.get(0xdda6);

        expect(andAIX).not.toBeUndefined();
        let state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x87)
        };

        let transition = andAIX.process(state, [0xdd, 0xa6, 0x0a]);

        expect(transition).not.toBeUndefined();
        expect(transition.newRegisters.PC).toBe(1237);
        expect(transition.newRegisters.A).toBe(0x82);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(1244);

        let assember = andAIX.createAssembler('A', '(IX+10)');

        expect(assember).not.toBeUndefined();
        expect(assember.type).toBe('instruction');
        expect(assember.assembler).toBe('AND\tA <- (IX+10)');
        expect(assember.opcodes(undefined)).toEqual([0xdd, 0xa6, 0x0a]);
        expect(assember.size).toBe(3)
    });
});
