jest.autoMockOff()

const ShiftRightInstructions = require('../ShiftRightInstructions')
const byOpcode = new Map(ShiftRightInstructions.map(i => [i.opcode, i]))

describe('Shift right Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(ShiftRightInstructions.length)
    })

    it('should support SHR A', () => {
        const decA = byOpcode.get(0xcb3f)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 81
            }
        }
        const transition = decA.process(state, [0xcb, 0x3f])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(40)
        expect(transition.newFlags.C).toBe(true)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = decA.createAssembler([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('SHR\tA')
        expect(assembler.opcodes(null)).toEqual([0xcb, 0x3f])
        expect(assembler.size).toBe(2)
    })
})
