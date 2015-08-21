jest.autoMockOff()

const AndInstructions = require('../and')
const byOpcode = new Map(AndInstructions.map(i => [i.opcode, i]))

describe('And Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(AndInstructions.length)
    })

    it('should support AND A, B', () => {
        const andAB = byOpcode.get(0xa0)

        expect(andAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                B: 0x87
            }
        }
        const transition = andAB.process(state, [0xa0])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(0x82)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andAB.createAssembler()

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('AND\tA <- B')
        expect(assembler.opcodes(null)).toEqual([0xa0])
        expect(assembler.size).toBe(1)
    })

    it('should support AND A, 135', () => {
        const andA = byOpcode.get(0xe6)

        expect(andA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0xaa
            }
        }
        const transition = andA.process(state, [0xc6, 0x87])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(0x82)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andA.createAssembler('A', '135')

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('AND\tA <- 135')
        expect(assembler.opcodes(null)).toEqual([0xe6, 0x87])
        expect(assembler.size).toBe(2)
    })

    it('should support AND A, (HL)', () => {
        const andAHL = byOpcode.get(0xa6)

        expect(andAHL).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x87)
        }
        const transition = andAHL.process(state, [0xa6])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(0x82)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1234)

        const assembler = andAHL.createAssembler()

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('AND\tA <- (HL)')
        expect(assembler.opcodes(null)).toEqual([0xa6])
        expect(assembler.size).toBe(1)
    })

    it('should support AND A, (IX+d)', () => {
        const andAIX = byOpcode.get(0xdda6)

        expect(andAIX).toBeDefined()
        const state = {
            registers: {
                PC: 1234,
                A: 0xaa,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x87)
        }

        const transition = andAIX.process(state, [0xdd, 0xa6, 0x0a])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1237)
        expect(transition.newRegisters.A).toBe(0x82)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1244)

        const assembler = andAIX.createAssembler('A', '(IX+10)')

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('AND\tA <- (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xa6, 0x0a])
        expect(assembler.size).toBe(3)
    })
})
