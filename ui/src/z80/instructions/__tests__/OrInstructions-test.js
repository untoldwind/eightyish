jest.autoMockOff()

const OrInstructions = require('../OrInstructions')
const byOpcode = new Map(OrInstructions.map(i => [i.opcode, i]))

describe('Or Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(OrInstructions.length)
    })

    it('should support OR A, B', () => {
        const andAB = byOpcode.get(0xb0)

        expect(andAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x12,
                B: 0x45
            }
        }
        const transition = andAB.process(state, [0xb0])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(0x57)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = andAB.createAssembler([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('OR\tA <- B')
        expect(assembler.opcodes(null)).toEqual([0xb0])
        expect(assembler.size).toBe(1)
    })

    it('should support OR A, 135', () => {
        const andA = byOpcode.get(0xf6)

        expect(andA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x12
            }
        }
        const transition = andA.process(state, [0xc6, 0x45])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(0x57)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = andA.createAssembler([null, 135])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('OR\tA <- 135')
        expect(assembler.opcodes(null)).toEqual([0xf6, 0x87])
        expect(assembler.size).toBe(2)
    })

    it('should support OR A, (HL)', () => {
        const andAHL = byOpcode.get(0xb6)

        expect(andAHL).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x12,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x45)
        }
        const transition = andAHL.process(state, [0xb6])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(0x57)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.Z).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1234)

        const assembler = andAHL.createAssembler([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('OR\tA <- (HL)')
        expect(assembler.opcodes(null)).toEqual([0xb6])
        expect(assembler.size).toBe(1)
    })

    it('should support OR A, (IX+d)', () => {
        const andAIX = byOpcode.get(0xddb6)

        expect(andAIX).toBeDefined()
        const state = {
            registers: {
                PC: 1234,
                A: 0x12,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x45)
        }

        const transition = andAIX.process(state, [0xdd, 0xa6, 0x0a])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1237)
        expect(transition.newRegisters.A).toBe(0x57)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.Z).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1244)

        const assembler = andAIX.createAssembler([null, 10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('OR\tA <- (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xb6, 0x0a])
        expect(assembler.size).toBe(3)
    })
})
