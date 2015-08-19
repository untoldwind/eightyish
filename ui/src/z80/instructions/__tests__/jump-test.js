jest.autoMockOff();

let jump_instructions = require('../jump');
let byOpcode = new Map(jump_instructions.map(i => [i.opcode, i]));

describe('Call Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(jump_instructions.length)
    });

    it('should support JUMP address', () => {
        let jumpAddress = byOpcode.get(0xc3);

        expect(jumpAddress).toBeDefined();

        let state = {
            registers: {
                PC: 0x1234
            }
        };
        let transition = jumpAddress.process(state, [0xc3, 0xab, 0xcd]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(0xabcd);

        let assembler = jumpAddress.createAssembler('.label');
        let labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('JUMP\t.label');
        expect(assembler.opcodes(labels)).toEqual([0xc3, 0x12, 0x34]);
        expect(assembler.size).toBe(3);
        expect(labels.getAddress).toBeCalledWith('.label');
    });

    it('should support JUMP NZ, address', () => {
        let jumpAddress = byOpcode.get(0xc2);

        expect(jumpAddress).toBeDefined();
        let state = {
            registers: {
                PC: 0x1234,
                flagZ: true
            }
        };
        let zeroTransition = jumpAddress.process(state, [0xc2, 0xab, 0xcd]);

        expect(zeroTransition).toBeDefined();
        expect(zeroTransition.newRegisters.PC).toBe(0x1237);

        state.registers.flagZ = false;
        let nonZeroTransition = jumpAddress.process(state, [0xc2, 0xab, 0xcd]);

        expect(nonZeroTransition).toBeDefined();
        expect(nonZeroTransition.newRegisters.PC).toBe(0xabcd);

        let assembler = jumpAddress.createAssembler(undefined, '.label');
        let labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('JUMP\tNZ, .label');
        expect(assembler.opcodes(labels)).toEqual([0xc2, 0x12, 0x34]);
        expect(assembler.size).toBe(3);
        expect(labels.getAddress).toBeCalledWith('.label');
    });
});