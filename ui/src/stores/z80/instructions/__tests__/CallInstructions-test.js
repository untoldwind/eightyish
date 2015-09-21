jest.autoMockOff()

const CallInstructions = require('../CallInstructions').instructions
const byOpcode = new Map(CallInstructions.map(i => [i.opcode, i]))

describe('Call Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(CallInstructions.length)
    })

    it('should support CALL address', () => {
        const callAddress = byOpcode.get(0xcd)

        expect(callAddress).toBeDefined()

        const state = {
            registers: {
                PC: 0x1234,
                SP: 0x2345
            }
        }
        const transition = callAddress.process(state, new Uint8Array([0xcd, 0xab, 0xcd]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(0xabcd)
        expect(transition.newRegisters.SP).toBe(0x2343)
        expect(transition.memoryOffset).toBe(0x2343)
        expect(transition.newMemoryData).toEqual([0x12, 0x37])

        const assembler = callAddress.createStatement(['.label'])
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        }

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  CALL   .label')
        expect(assembler.opcodes(labels)).toEqual([0xcd, 0x12, 0x34])
        expect(assembler.size).toBe(3)
        expect(labels.getAddress).toBeCalledWith('.label')
    })

    it('should support CALL NZ, address', () => {
        const callAddress = byOpcode.get(0xc4)

        expect(callAddress).toBeDefined()
        const state = {
            registers: {
                PC: 0x1234,
                SP: 0x2345,
                flagZ: true
            }
        }
        const zeroTransition = callAddress.process(state, new Uint8Array([0xc4, 0xab, 0xcd]))

        expect(zeroTransition).toBeDefined()
        expect(zeroTransition.newRegisters.PC).toBe(0x1237)
        expect(zeroTransition.newRegisters.SP).toBeUndefined()
        expect(zeroTransition.memoryOffset).toBeUndefined()

        state.registers.flagZ = false
        const nonZeroTransition = callAddress.process(state, new Uint8Array([0xc4, 0xab, 0xcd]))

        expect(nonZeroTransition).toBeDefined()
        expect(nonZeroTransition.newRegisters.PC).toBe(0xabcd)
        expect(nonZeroTransition.newRegisters.SP).toBe(0x2343)
        expect(nonZeroTransition.memoryOffset).toBe(0x2343)
        expect(nonZeroTransition.newMemoryData).toEqual([0x12, 0x37])

        const assembler = callAddress.createStatement([null, '.label'])
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        }

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  CALL   NZ, .label')
        expect(assembler.opcodes(labels)).toEqual([0xc4, 0x12, 0x34])
        expect(assembler.size).toBe(3)
        expect(labels.getAddress).toBeCalledWith('.label')
    })
})
