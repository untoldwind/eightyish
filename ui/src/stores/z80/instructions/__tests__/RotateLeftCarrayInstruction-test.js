jest.autoMockOff()

const RotateLeftCarryInstructions = require('../RotateLeftCarryInstructions').instructions
const byOpcode = new Map(RotateLeftCarryInstructions.map(i => [i.opcode, i]))

describe('Rotate left with carry Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(RotateLeftCarryInstructions.length)
    })

    it('should support ROTLC A', () => {
        const decA = byOpcode.get(0xcb17)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x83,
                flagC: false
            }
        }
        const transition = decA.process(state, new Uint8Array([0xcb, 0x17]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(0x6)
        expect(transition.newRegisters.flagC).toBe(true)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = decA.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  ROTLC  A')
        expect(assembler.opcodes(null)).toEqual([0xcb, 0x17])
        expect(assembler.size).toBe(2)
    })

    it('should support ROTLC (IX+d)', () => {
        const decA = byOpcode.get(0xddcb16)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                IX: 0xabcd,
                flagC: true
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x41)
        }
        const transition = decA.process(state, new Uint8Array([0xdd, 0xcb, 0x2, 0x16]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1238)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(true)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(transition.memoryOffset).toBe(0xabcf)
        expect(transition.newMemoryData).toEqual([0x83])
        expect(state.getMemoryByte).toBeCalledWith(0xabcf)

        const assembler = decA.createStatement([10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  ROTLC  (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xcb, 0xa, 0x16])
        expect(assembler.size).toBe(4)
    })
})
