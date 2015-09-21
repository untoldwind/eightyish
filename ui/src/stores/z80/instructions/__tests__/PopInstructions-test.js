jest.autoMockOff()

const PopInstructions = require('../PopInstructions').instructions
const byOpcode = new Map(PopInstructions.map(i => [i.opcode, i]))

describe('Stack Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(PopInstructions.length)
    })

    it('should support POP BC', () => {
        const loadAB = byOpcode.get(0xc1)

        expect(loadAB).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                SP: 2345
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(0xabcd)
        }
        const transition = loadAB.process(state, new Uint8Array([0xc1]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.SP).toBe(2347)
        expect(transition.newRegisters.BC).toBe(0xabcd)

        const assembler = loadAB.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  POP    BC')
        expect(assembler.opcodes(null)).toEqual([0xc1])
        expect(assembler.size).toBe(1)
    })
})
