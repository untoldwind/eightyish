jest.autoMockOff()

const DecInstructions = require('../DecInstructions').instructions
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
        const transition = decA.process(state, new Uint8Array([0x3d]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(8)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = decA.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  DEC    A')
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
        const transition = decBC.process(state, new Uint8Array([0x0b]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.BC).toBe(122)
        expect(transition.newRegisters.flagS).toBeUndefined()
        expect(transition.newRegisters.flagP).toBeUndefined()
        expect(transition.newRegisters.flagZ).toBeUndefined()

        const assembler = decBC.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  DEC    BC')
        expect(assembler.opcodes(null)).toEqual([0x0b])
        expect(assembler.size).toBe(1)
    })
})
