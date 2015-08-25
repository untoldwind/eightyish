jest.autoMockOff()

const DecInstructions = require('../DecInstructions')
const byOpcode = new Map(DecInstructions.map(i => [i.opcode, i]))

describe('Dec Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(DecInstructions.length)
    })

    it('should support DEC A', () => {
        const decA = byOpcode.get(0x3d)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 9
            }
        }
        const transition = decA.process(state, [0x3d])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(8)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = decA.createAssembler([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('DEC\tA')
        expect(assembler.opcodes(null)).toEqual([0x3d])
        expect(assembler.size).toBe(1)
    })

    it('should support DEC BC', () => {
        const decBC = byOpcode.get(0x0b)

        expect(decBC).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                BC: 123
            }
        }
        const transition = decBC.process(state, [0x0b])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.BC).toBe(122)
        expect(transition.newFlags.C).toBeUndefined()
        expect(transition.newFlags.S).toBeUndefined()
        expect(transition.newFlags.P).toBeUndefined()
        expect(transition.newFlags.Z).toBeUndefined()

        const assembler = decBC.createAssembler([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('DEC\tBC')
        expect(assembler.opcodes(null)).toEqual([0x0b])
        expect(assembler.size).toBe(1)
    })
})
