jest.autoMockOff()

const NopInstruction = require('../NopInstruction').instructions
const byOpcode = new Map(NopInstruction.map(i => [i.opcode, i]))

describe('Core Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(NopInstruction.length)
    })

    it('should support NOP', () => {
        const nop = byOpcode.get(0x0)

        expect(nop).toBeDefined()

        const state = {
            registers: {
                PC: 1234
            }
        }
        const transition = nop.process(state, new Uint8Array([0x0]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1235)

        const assembler = nop.createStatement([])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  NOP')
        expect(assembler.opcodes(null)).toEqual([0x0])
        expect(assembler.size).toBe(1)
    })
})
