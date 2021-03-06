jest.autoMockOff()

const Instruction = require('../Instruction')
const BytePointerArgument = require('../../arguments/BytePointerArgument')

describe('Instruction', () => {
    it('should create single byte opcode for simple instructions', () => {
        const instruction = new Instruction(0x12, 10, 'TEST', [])

        expect(instruction.size).toBe(1)
        expect(instruction.opcodes).toEqual([0x12])
        expect(instruction.name).toBe('TEST')
    })

    it('should create double opcode for extension instructions', () => {
        const instruction = new Instruction(0x1234, 10, 'EXTENDED', [])

        expect(instruction.size).toBe(2)
        expect(instruction.opcodes).toEqual([0x12, 0x34])
    })

    it('should honor extra size', () => {
        const instruction = new Instruction(0x1234, 10, 'EXTENDED2', [BytePointerArgument])

        expect(instruction.size).toBe(4)
        expect(instruction.opcodes).toEqual([0x12, 0x34])
    })
})
