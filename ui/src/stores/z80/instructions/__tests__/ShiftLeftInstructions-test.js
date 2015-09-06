jest.autoMockOff()

const ShiftLeftInstructions = require('../ShiftLeftInstructions')
const byOpcode = new Map(ShiftLeftInstructions.map(i => [i.opcode, i]))

describe('Shift left Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(ShiftLeftInstructions.length)
    })

    it('should support SHL A', () => {
        const decA = byOpcode.get(0xcb27)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 9
            }
        }
        const transition = decA.process(state, new Uint8Array([0xcb, 0x27]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(18)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = decA.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  SHL    A')
        expect(assembler.opcodes(null)).toEqual([0xcb, 0x27])
        expect(assembler.size).toBe(2)
    })

    it('should support SHL (IX+d)', () => {
        const decA = byOpcode.get(0xddcb26)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                IX: 0xabcd
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(9)
        }
        const transition = decA.process(state, new Uint8Array([0xdd, 0xcb, 0x2, 0x26]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1238)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(transition.memoryOffset).toBe(0xabcf)
        expect(transition.newMemoryData).toEqual([18])
        expect(state.getMemoryByte).toBeCalledWith(0xabcf)

        const assembler = decA.createStatement([10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  SHL    (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xcb, 0xa, 0x26])
        expect(assembler.size).toBe(4)
    })
})
