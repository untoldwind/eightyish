jest.autoMockOff()

const ShiftLeftInstructions = require('../ShiftLeftInstructions')
const byOpcode = new Map(ShiftLeftInstructions.map(i => [i.opcode, i]))

describe('Shift left Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(ShiftLeftInstructions.length)
    })

    it('should support SHL A', () => {
        const decA = byOpcode.get(0xcb27)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 9
            }
        }
        const transition = decA.process(state, [0xcb, 0x27])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(18)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = decA.createAssembler([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('SHL\tA')
        expect(assembler.opcodes(null)).toEqual([0xcb, 0x27])
        expect(assembler.size).toBe(2)
    })
})
