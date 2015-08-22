jest.autoMockOff()

const JumpInstructions = require('../jump')
const byOpcode = new Map(JumpInstructions.map(i => [i.opcode, i]))

describe('Call Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(JumpInstructions.length)
    })

    it('should support JUMP address', () => {
        const jumpAddress = byOpcode.get(0xc3)

        expect(jumpAddress).toBeDefined()

        const state = {
            registers: {
                PC: 0x1234
            }
        }
        const transition = jumpAddress.process(state, [0xc3, 0xab, 0xcd])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(0xabcd)

        const assembler = jumpAddress.createAssembler(['.label'])
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        }

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('JUMP\t.label')
        expect(assembler.opcodes(labels)).toEqual([0xc3, 0x12, 0x34])
        expect(assembler.size).toBe(3)
        expect(labels.getAddress).toBeCalledWith('.label')
    })

    it('should support JUMP NZ, address', () => {
        const jumpAddress = byOpcode.get(0xc2)

        expect(jumpAddress).toBeDefined()
        const state = {
            registers: {
                PC: 0x1234,
                flagZ: true
            }
        }
        const zeroTransition = jumpAddress.process(state, [0xc2, 0xab, 0xcd])

        expect(zeroTransition).toBeDefined()
        expect(zeroTransition.newRegisters.PC).toBe(0x1237)

        state.registers.flagZ = false
        const nonZeroTransition = jumpAddress.process(state, [0xc2, 0xab, 0xcd])

        expect(nonZeroTransition).toBeDefined()
        expect(nonZeroTransition.newRegisters.PC).toBe(0xabcd)

        const assembler = jumpAddress.createAssembler([null, '.label'])
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0x12, 0x34])
        }

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('JUMP\tNZ, .label')
        expect(assembler.opcodes(labels)).toEqual([0xc2, 0x12, 0x34])
        expect(assembler.size).toBe(3)
        expect(labels.getAddress).toBeCalledWith('.label')
    })
})
