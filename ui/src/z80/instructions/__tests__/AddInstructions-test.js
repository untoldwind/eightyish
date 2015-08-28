jest.autoMockOff()

const AddInstructions = require('../AddInstructions')
const byOpcode = new Map(AddInstructions.map(i => [i.opcode, i]))

describe('Add Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(AddInstructions.length)
    })

    it('should support ADD A, B', () => {
        const addAB = byOpcode.get(0x80)

        expect(addAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                B: 5
            }
        }
        const transition = addAB.process(state, [0x80])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(15)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = addAB.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ADD\tA <- B')
        expect(assembler.opcodes(null)).toEqual([0x80])
        expect(assembler.size).toBe(1)
    })

    it('should support ADD A, 10', () => {
        const addA = byOpcode.get(0xc6)

        expect(addA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10
            }
        }
        const transition = addA.process(state, [0xc6, 0x0a])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(20)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = addA.createStatement([null, 10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ADD\tA <- 10')
        expect(assembler.opcodes(null)).toEqual([0xc6, 0x0a])
        expect(assembler.size).toBe(2)
    })

    it('should support ADD A, (HL)', () => {
        const addAHL = byOpcode.get(0x86)

        expect(addAHL).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                HL: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(5)
        }
        const transition = addAHL.process(state, [0x86])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(15)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1234)

        const assembler = addAHL.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ADD\tA <- (HL)')
        expect(assembler.opcodes(null)).toEqual([0x86])
        expect(assembler.size).toBe(1)
    })

    it('should support ADD A, (IX+d)', () => {
        const addAIX = byOpcode.get(0xdd86)

        expect(addAIX).toBeDefined()
        const state = {
            registers: {
                PC: 1234,
                A: 10,
                IX: 1234
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(5)
        }

        const transition = addAIX.process(state, [0xdd, 0x86, 0x0a])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1237)
        expect(transition.newRegisters.A).toBe(15)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)
        expect(state.getMemoryByte).toBeCalledWith(1244)

        const assembler = addAIX.createStatement([null, 10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ADD\tA <- (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0x86, 0x0a])
        expect(assembler.size).toBe(3)
    })

    it('should support word register adding', () => {
        const addHLBC = byOpcode.get(0x09)

        expect(addHLBC).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                HL: 123,
                BC: 234
            }
        }
        const transition = addHLBC.process(state, [0x09])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.HL).toBe(357)
        expect(transition.newFlags.C).toBeUndefined()
        expect(transition.newFlags.S).toBeUndefined()
        expect(transition.newFlags.P).toBeUndefined()
        expect(transition.newFlags.Z).toBeUndefined()

        const assembler = addHLBC.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ADD\tHL <- BC')
        expect(assembler.size).toBe(1)
    })
})
