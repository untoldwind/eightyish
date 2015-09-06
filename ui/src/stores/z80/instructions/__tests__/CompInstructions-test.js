jest.autoMockOff()

const CompInstructions = require('../CompInstructions')
const byOpcode = new Map(CompInstructions.map(i => [i.opcode, i]))

describe('Compate Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(CompInstructions.length)
    })

    it('should support COMP A, B', () => {
        const andAB = byOpcode.get(0xb8)

        expect(andAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 7,
                B: 7
            }
        }
        const transition = andAB.process(state, new Uint8Array([0xb8]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(true)

        const assembler = andAB.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  COMP   A, B')
        expect(assembler.opcodes(null)).toEqual([0xb8])
        expect(assembler.size).toBe(1)
    })

    it('should support COMP A, 135', () => {
        const andA = byOpcode.get(0xfe)

        expect(andA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10
            }
        }
        const transition = andA.process(state, new Uint8Array([0xfe, 17]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.flagC).toBe(true)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andA.createStatement([null, 135])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  COMP   A, 135')
        expect(assembler.opcodes(null)).toEqual([0xfe, 0x87])
        expect(assembler.size).toBe(2)
    })

    it('should support SUB A, (HL)', () => {
        const andAHL = byOpcode.get(0xbe)

        expect(andAHL).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(7)
        }
        const transition = andAHL.process(state, new Uint8Array([0xbe]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1234)

        const assembler = andAHL.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  COMP   A, (HL)')
        expect(assembler.opcodes(null)).toEqual([0xbe])
        expect(assembler.size).toBe(1)
    })

    it('should support AND A, (IX+d)', () => {
        const andAIX = byOpcode.get(0xddbe)

        expect(andAIX).toBeDefined()
        const state = {
            registers: {
                PC: 1234,
                A: 10,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(7)
        }

        const transition = andAIX.process(state, new Uint8Array([0xdd, 0xbe, 0x0a]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1237)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1244)

        const assembler = andAIX.createStatement([null, 10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  COMP   A, (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xbe, 0x0a])
        expect(assembler.size).toBe(3)
    })
})
