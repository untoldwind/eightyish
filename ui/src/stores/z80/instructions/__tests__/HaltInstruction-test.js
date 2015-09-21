jest.autoMockOff()

const HaltInstruction = require('../HaltInstruction').instructions
const byOpcode = new Map(HaltInstruction.map(i => [i.opcode, i]))

describe('Core Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(HaltInstruction.length)
    })

    it('should support HALT', () => {
        const nop = byOpcode.get(0x76)

        expect(nop).toBeDefined()

        const state = {}
        const transition = nop.process(state, new Uint8Array([0x76]))

        expect(transition).toBeNull()

        const assembler = nop.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  HALT')
        expect(assembler.opcodes(null)).toEqual([0x76])
        expect(assembler.size).toBe(1)
    })
})
