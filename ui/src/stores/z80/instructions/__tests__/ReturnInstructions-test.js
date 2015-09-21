jest.autoMockOff()

const ReturnInstructions = require('../ReturnInstructions').instructions
const byOpcode = new Map(ReturnInstructions.map(i => [i.opcode, i]))

describe('Return Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(ReturnInstructions.length)
    })

    it('should support RET', () => {
        const ret = byOpcode.get(0xc9)

        expect(ret).toBeDefined()

        const state = {
            registers: {
                PC: 0xabcd,
                SP: 0x2345
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(0x1234)
        }
        const transition = ret.process(state, new Uint8Array([0xc9]))
        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(0x1234)
        expect(transition.newRegisters.SP).toBe(0x2347)

        const assembler = ret.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  RET')
        expect(assembler.opcodes(null)).toEqual([0xc9])
        expect(assembler.size).toBe(1)
    })

    it('should support RET NZ', () => {
        const ret = byOpcode.get(0xc0)

        expect(ret).toBeDefined()

        const state = {
            registers: {
                PC: 0xabcd,
                SP: 0x2345,
                flagZ: true
            },
            getMemoryWord: jest.genMockFunction().mockReturnValue(0x1234)
        }
        const zeroTransition = ret.process(state, new Uint8Array([0xc0]))
        expect(zeroTransition).toBeDefined()
        expect(zeroTransition.newRegisters.PC).toBe(0xabce)
        expect(zeroTransition.newRegisters.SP).toBeUndefined()

        state.registers.flagZ = false
        const nonZerotransition = ret.process(state, new Uint8Array([0xc0]))
        expect(nonZerotransition).toBeDefined()
        expect(nonZerotransition.newRegisters.PC).toBe(0x1234)
        expect(nonZerotransition.newRegisters.SP).toBe(0x2347)

        const assembler = ret.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  RET    NZ')
        expect(assembler.opcodes(null)).toEqual([0xc0])
        expect(assembler.size).toBe(1)
    })
})
