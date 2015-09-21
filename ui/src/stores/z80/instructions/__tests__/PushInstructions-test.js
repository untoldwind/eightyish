jest.autoMockOff()

const PushInstructions = require('../PushInstructions').instructions
const byOpcode = new Map(PushInstructions.map(i => [i.opcode, i]))

describe('Stack Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(PushInstructions.length)
    })

    it('should support PUSH BC', () => {
        const loadAB = byOpcode.get(0xc5)

        expect(loadAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                SP: 2345,
                BC: 0xabcd
            }
        }
        const transition = loadAB.process(state, new Uint8Array([0xc5]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.SP).toBe(2343)
        expect(transition.memoryOffset).toBe(2343)
        expect(transition.newMemoryData).toEqual([0xab, 0xcd])

        const assembler = loadAB.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  PUSH   BC')
        expect(assembler.opcodes(null)).toEqual([0xc5])
        expect(assembler.size).toBe(1)
    })
})
