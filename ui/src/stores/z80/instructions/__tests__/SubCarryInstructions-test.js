jest.autoMockOff()

const SubCarryInstructions = require('../SubCarryInstructions').instructions
const byOpcode = new Map(SubCarryInstructions.map(i => [i.opcode, i]))

describe('SubCarry Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(SubCarryInstructions.length)
    })

    it('should support SUBC A, B', () => {
        const andAB = byOpcode.get(0x98)

        expect(andAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                B: 7,
                flagC: true
            }
        }
        const transition = andAB.process(state, new Uint8Array([0x98]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(2)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = andAB.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  SUBC   A <- B')
        expect(assembler.opcodes(null)).toEqual([0x98])
        expect(assembler.size).toBe(1)
    })

    it('should support word register subtraction', () => {
        const subHLBC = byOpcode.get(0xed42)

        expect(subHLBC).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                HL: 234,
                BC: 123,
                flagC: true
            }
        }
        const transition = subHLBC.process(state, new Uint8Array([0xed, 0x42]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.HL).toBe(110)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = subHLBC.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  SUBC   HL <- BC')
        expect(assembler.size).toBe(2)
    })
})