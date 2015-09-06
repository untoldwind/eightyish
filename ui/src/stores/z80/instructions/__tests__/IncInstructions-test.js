jest.autoMockOff()

const IncInstructions = require('../IncInstructions')
const byOpcode = new Map(IncInstructions.map(i => [i.opcode, i]))

describe('Inc Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(IncInstructions.length)
    })

    it('should support INC A', () => {
        const incA = byOpcode.get(0x3c)

        expect(incA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 9
            }
        }
        const transition = incA.process(state, new Uint8Array([0x3c]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(10)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = incA.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  INC    A')
        expect(assembler.opcodes(null)).toEqual([0x3c])
        expect(assembler.size).toBe(1)
    })

    it('should support INC BC', () => {
        const incBC = byOpcode.get(0x03)

        expect(incBC).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                BC: 123
            }
        }
        const transition = incBC.process(state, new Uint8Array([0x03]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.BC).toBe(124)
        expect(transition.newFlags.S).toBeUndefined()
        expect(transition.newFlags.P).toBeUndefined()
        expect(transition.newFlags.Z).toBeUndefined()

        const assembler = incBC.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  INC    BC')
        expect(assembler.opcodes(null)).toEqual([0x03])
        expect(assembler.size).toBe(1)
    })
})
