jest.autoMockOff();

const load_instructions = require('../load');
const byOpcode = new Map(load_instructions.map(i => [i.opcode, i]));

describe('Load Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(load_instructions.length);
    });

    it('should support LOAD A, B', () => {
        const loadAB = byOpcode.get(0x78);

        expect(loadAB).toBeDefined();

        const state = {
            registers: {
                PC: 1234,
                B: 5
            }
        };
        const transition = loadAB.process(state, [0x78]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.A).toBe(5);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);

        const assembler = loadAB.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('LOAD\tA <- B');
        expect(assembler.opcodes(undefined)).toEqual([0x78]);
        expect(assembler.size).toBe(1);
    });

    it('should support LOAD SP, HL', () => {
        const loadSPHL = byOpcode.get(0xf9);

        expect(loadSPHL).toBeDefined();

        const state = {
            registers: {
                PC: 1234,
                HL: 0xabcd
            }
        };
        const transition = loadSPHL.process(state, [0xf9]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1235);
        expect(transition.newRegisters.SP).toBe(0xabcd);

        const assembler = loadSPHL.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('LOAD\tSP <- HL');
        expect(assembler.opcodes(undefined)).toEqual([0xf9]);
        expect(assembler.size).toBe(1);
    });

    it('should support LOAD A, (address)', () => {
        const loadAMem = byOpcode.get(0x3a);

        expect(loadAMem).toBeDefined();

        const state = {
            registers: {
                PC: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(5)
        };
        const transition = loadAMem.process(state, [0x3a, 0xab, 0xcd]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1237);
        expect(transition.newRegisters.A).toBe(5);
        expect(transition.newRegisters.flagC).toBe(false);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagP).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(state.getMemoryByte).toBeCalledWith(0xabcd);

        const assembler = loadAMem.createAssembler(undefined, '(.label)');
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('LOAD\tA <- (.label)');
        expect(assembler.opcodes(labels)).toEqual([0x3a, 0x12, 0x34]);
        expect(assembler.size).toBe(3);
    });

    it('should support LOAD (address), A', () => {
        const loadAMem = byOpcode.get(0x32);

        expect(loadAMem).toBeDefined();

        const state = {
            registers: {
                PC: 1234,
                A: 10
            }
        };
        const transition = loadAMem.process(state, [0x32, 0xab, 0xcd]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1237);
        expect(transition.memoryOffset).toBe(0xabcd);
        expect(transition.newMemoryData).toEqual([10]);

        const assembler = loadAMem.createAssembler('(.label)');
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('LOAD\t(.label) <- A');
        expect(assembler.opcodes(labels)).toEqual([0x32, 0x12, 0x34]);
        expect(assembler.size).toBe(3);
    });

    it('should support LOAD BC, (address)', () => {
        const loadAMem = byOpcode.get(0xed4b);

        expect(loadAMem).toBeDefined();

        const state = {
            registers: {
                PC: 1234
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(2345)
        };
        const transition = loadAMem.process(state, [0xed, 0x4b, 0xab, 0xcd]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1238);
        expect(transition.newRegisters.BC).toBe(2345);
        expect(state.getMemoryWord).toBeCalledWith(0xabcd);

        const assembler = loadAMem.createAssembler(undefined, '(.label)');
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('LOAD\tBC <- (.label)');
        expect(assembler.opcodes(labels)).toEqual([0xed, 0x4b, 0x12, 0x34]);
        expect(assembler.size).toBe(4);
    });

    it('should support LOAD (address), BC', () => {
        const loadAMem = byOpcode.get(0xed43);

        expect(loadAMem).toBeDefined();

        const state = {
            registers: {
                PC: 1234,
                BC: 0x2345
            }
        };
        const transition = loadAMem.process(state, [0xed, 0x43, 0xab, 0xcd]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(1238);
        expect(transition.memoryOffset).toBe(0xabcd);
        expect(transition.newMemoryData).toEqual([0x23, 0x45]);

        const assembler = loadAMem.createAssembler('(.label)');
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('LOAD\t(.label) <- BC');
        expect(assembler.opcodes(labels)).toEqual([0xed, 0x43, 0x12, 0x34]);
        expect(assembler.size).toBe(4);
    });
});