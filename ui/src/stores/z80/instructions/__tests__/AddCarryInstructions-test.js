jest.autoMockOff()

const AddCarryInstructions = require('../AddCarryInstructions').instructions
const byOpcode = new Map(AddCarryInstructions.map(i => [i.opcode, i]))

describe('AddCarry Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(AddCarryInstructions.length)
    })

    it('should support ADDC A, B', () => {
        const addAB = byOpcode.get(0x88)

        expect(addAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 10,
                B: 5,
                flagC: true
            }
        }
        const transition = addAB.process(state, new Uint8Array([0x88]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.A).toBe(16)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = addAB.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  ADDC   A <- B')
        expect(assembler.opcodes(null)).toEqual([0x88])
        expect(assembler.size).toBe(1)
    })

    it('should support word register adding', () => {
        const addHLBC = byOpcode.get(0xed4a)

        expect(addHLBC).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                HL: 123,
                BC: 234,
                flagC: true
            }
        }
        const transition = addHLBC.process(state, new Uint8Array([0xed, 0x4a]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.HL).toBe(358)
        expect(transition.newRegisters.flagC).toBeUndefined()
        expect(transition.newRegisters.flagS).toBeUndefined()
        expect(transition.newRegisters.flagP).toBeUndefined()
        expect(transition.newRegisters.flagZ).toBeUndefined()

        const assembler = addHLBC.createStatement([null, null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  ADDC   HL <- BC')
        expect(assembler.size).toBe(2)
    })
})