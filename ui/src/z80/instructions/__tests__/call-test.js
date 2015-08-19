jest.autoMockOff();

let call_instructions = require('../call');
let byOpcode = new Map(call_instructions.map(i => [i.opcode, i]));

describe('Call Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(call_instructions.length)
    });

    it('should support CALL address', () => {
        let callAddress = byOpcode.get(0xcd);

        expect(callAddress).toBeDefined();

        let state = {
            registers: {
                PC: 0x1234,
                SP: 0x2345
            }
        };
        let transition = callAddress.process(state, [0xcd, 0xab, 0xcd]);

        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(0xabcd);
        expect(transition.newRegisters.SP).toBe(0x2343);
        expect(transition.memoryOffset).toBe(0x2343);
        expect(transition.newMemoryData).toEqual([0x12, 0x37])

        let assembler = callAddress.createAssembler('.label');
        let labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        };

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('CALL\t.label');
        expect(assembler.opcodes(labels)).toEqual([0xcd, 0x12, 0x34]);
        expect(assembler.size).toBe(3);
        expect(labels.getAddress).toBeCalledWith('.label');
    });

    it('should support RET', () => {
        let ret = byOpcode.get(0xc9);

        expect(ret).toBeDefined();

        let state = {
            registers: {
                PC: 0xabcd,
                SP: 0x2345
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(0x1234)
        };
        let transition = ret.process(state, [0xc9]);
        expect(transition).toBeDefined();
        expect(transition.newRegisters.PC).toBe(0x1234);
        expect(transition.newRegisters.SP).toBe(0x2347);

        let assembler = ret.createAssembler();

        expect(assembler).toBeDefined();
        expect(assembler.type).toBe('instruction');
        expect(assembler.assembler).toBe('RET');
        expect(assembler.opcodes(undefined)).toEqual([0xc9]);
        expect(assembler.size).toBe(1);
    });
});