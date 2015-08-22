jest.autoMockOff()

const XorInstructions = require('../xor')
const byOpcode = new Map(XorInstructions.map(i => [i.opcode, i]))

describe('Xor Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(XorInstructions.length)
    })

    it('should support XOR A, B', () => {
        const andAB = byOpcode.get(0xa8)

        expect(andAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x12,
                B: 0x34
            }
        }
        const transition = andAB.process(state, [0xa8])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(0x26)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andAB.createAssembler([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('XOR\tA <- B')
        expect(assembler.opcodes(null)).toEqual([0xa8])
        expect(assembler.size).toBe(1)
    })

    it('should support XOR A, 135', () => {
        const andA = byOpcode.get(0xee)

        expect(andA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x12
            }
        }
        const transition = andA.process(state, [0xee, 0x34])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(0x26)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andA.createAssembler([null, 135])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('XOR\tA <- 135')
        expect(assembler.opcodes(null)).toEqual([0xee, 0x87])
        expect(assembler.size).toBe(2)
    })

    it('should support XOR A, (HL)', () => {
        const andAHL = byOpcode.get(0xae)

        expect(andAHL).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x12,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x34)
        }
        const transition = andAHL.process(state, [0xae])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(0x26)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1234)

        const assembler = andAHL.createAssembler([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('XOR\tA <- (HL)')
        expect(assembler.opcodes(null)).toEqual([0xae])
        expect(assembler.size).toBe(1)
    })

    it('should support XOR A, (IX+d)', () => {
        const andAIX = byOpcode.get(0xddae)

        expect(andAIX).toBeDefined()
        const state = {
            registers: {
                PC: 1234,
                A: 0x12,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x34)
        }

        const transition = andAIX.process(state, [0xdd, 0xae, 0x0a])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1237)
        expect(transition.newRegisters.A).toBe(0x26)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1244)

        const assembler = andAIX.createAssembler([null, 10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('XOR\tA <- (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xae, 0x0a])
        expect(assembler.size).toBe(3)
    })
})
