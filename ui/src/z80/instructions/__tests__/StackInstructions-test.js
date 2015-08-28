jest.autoMockOff()

const StackInstructions = require('../StackInstructions')
const byOpcode = new Map(StackInstructions.map(i => [i.opcode, i]))

describe('Stack Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(StackInstructions.length)
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
        const transition = loadAB.process(state, [0xc5])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.SP).toBe(2343)
        expect(transition.memoryOffset).toBe(2343)
        expect(transition.newMemoryData).toEqual([0xab, 0xcd])

        const assembler = loadAB.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('PUSH\tBC')
        expect(assembler.opcodes(null)).toEqual([0xc5])
        expect(assembler.size).toBe(1)
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
        const transition = loadAB.process(state, [0xc1])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)
        expect(transition.newRegisters.SP).toBe(2347)
        expect(transition.newRegisters.BC).toBe(0xabcd)

        const assembler = loadAB.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('POP\tBC')
        expect(assembler.opcodes(null)).toEqual([0xc1])
        expect(assembler.size).toBe(1)
    })
})
