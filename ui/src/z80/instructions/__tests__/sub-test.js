jest.autoMockOff()

const SubInstructions = require('../sub')
const byOpcode = new Map(SubInstructions.map(i => [i.opcode, i]))

describe('Sub Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(SubInstructions.length)
    })

    it('should support SUB A, B', () => {
        const andAB = byOpcode.get(0x90)

        expect(andAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                B: 7
            }
        }
        const transition = andAB.process(state, [0x90])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(3)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andAB.createAssembler()

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('SUB\tA <- B')
        expect(assembler.opcodes(null)).toEqual([0x90])
        expect(assembler.size).toBe(1)
    })

    it('should support SUB A, 135', () => {
        const andA = byOpcode.get(0xd6)

        expect(andA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10
            }
        }
        const transition = andA.process(state, [0xd6, 0x7])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(3)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andA.createAssembler('A', '135')

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('SUB\tA <- 135')
        expect(assembler.opcodes(null)).toEqual([0xd6, 0x87])
        expect(assembler.size).toBe(2)
    })

    it('should support SUB A, (HL)', () => {
        const andAHL = byOpcode.get(0x96)

        expect(andAHL).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(7)
        }
        const transition = andAHL.process(state, [0x96])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(3)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1234)

        const assembler = andAHL.createAssembler()

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('SUB\tA <- (HL)')
        expect(assembler.opcodes(null)).toEqual([0x96])
        expect(assembler.size).toBe(1)
    })

    it('should support AND A, (IX+d)', () => {
        const andAIX = byOpcode.get(0xdd96)

        expect(andAIX).toBeDefined()
        const state = {
            registers: {
                PC: 1234,
                A: 10,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(7)
        }

        const transition = andAIX.process(state, [0xdd, 0xa6, 0x0a])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1237)
        expect(transition.newRegisters.A).toBe(3)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1244)

        const assembler = andAIX.createAssembler('A', '(IX+10)')

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('SUB\tA <- (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0x96, 0x0a])
        expect(assembler.size).toBe(3)
    })
})
