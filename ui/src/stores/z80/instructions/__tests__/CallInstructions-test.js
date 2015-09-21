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

    it('should support RET', () => {
        const ret = byOpcode.get(0xc9)

        expect(ret).toBeDefined()

        const state = {
            registers: {
                PC: 0xabcd,
                SP: 0x2345
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(0x1234)
        }
        const transition = ret.process(state, new Uint8Array([0xc9]))
        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(0x1234)
        expect(transition.newRegisters.SP).toBe(0x2347)

        const assembler = ret.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  RET')
        expect(assembler.opcodes(null)).toEqual([0xc9])
        expect(assembler.size).toBe(1)
    })

    it('should support RET NZ', () => {
        const ret = byOpcode.get(0xc0)

        expect(ret).toBeDefined()

        const state = {
            registers: {
                PC: 0xabcd,
                SP: 0x2345,
                flagZ: true
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(0x1234)
        }
        const zeroTransition = ret.process(state, new Uint8Array([0xc0]))
        expect(zeroTransition).toBeDefined()
        expect(zeroTransition.newRegisters.PC).toBe(0xabce)
        expect(zeroTransition.newRegisters.SP).toBeUndefined()

        state.registers.flagZ = false
        const nonZerotransition = ret.process(state, new Uint8Array([0xc0]))
        expect(nonZerotransition).toBeDefined()
        expect(nonZerotransition.newRegisters.PC).toBe(0x1234)
        expect(nonZerotransition.newRegisters.SP).toBe(0x2347)

        const assembler = ret.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  RET    NZ')
        expect(assembler.opcodes(null)).toEqual([0xc0])
        expect(assembler.size).toBe(1)
    })
})
