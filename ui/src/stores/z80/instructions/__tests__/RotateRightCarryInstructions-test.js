jest.autoMockOff()

const RotateRightCarryInstructions = require('../RotateRightCarryInstructions')
const byOpcode = new Map(RotateRightCarryInstructions.map(i => [i.opcode, i]))

describe('Rotate right with carry Instruction', () => {
    it('should not have duplicate opcodes', () => {
        expect(byOpcode.size).toBe(RotateRightCarryInstructions.length)
    })

    it('should support ROTRC A', () => {
        const decA = byOpcode.get(0xcb1f)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                A: 0x83,
                flagC: false
            }
        }
        const transition = decA.process(state, new Uint8Array([0xcb, 0x1f]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(0x41)
        expect(transition.newRegisters.flagC).toBe(true)
        expect(transition.newRegisters.flagS).toBe(false)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)

        const assembler = decA.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  ROTRC  A')
        expect(assembler.opcodes(null)).toEqual([0xcb, 0x1f])
        expect(assembler.size).toBe(2)
    })

    it('should support ROTRC (IX+d)', () => {
        const decA = byOpcode.get(0xddcb1e)

        expect(decA).toBeDefined()

        const state = {
            registers: {
                PC: 1234,
                IX: 0xabcd,
                flagC: true
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x40)
        }
        const transition = decA.process(state, new Uint8Array([0xdd, 0xcb, 0x2, 0x16]))

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1238)
        expect(transition.newRegisters.flagC).toBe(false)
        expect(transition.newRegisters.flagS).toBe(true)
        expect(transition.newRegisters.flagP).toBe(false)
        expect(transition.newRegisters.flagZ).toBe(false)
        expect(transition.memoryOffset).toBe(0xabcf)
        expect(transition.newMemoryData).toEqual([0xa0])
        expect(state.getMemoryByte).toBeCalledWith(0xabcf)

        const assembler = decA.createStatement([10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('  ROTRC  (IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xcb, 0xa, 0x1e])
        expect(assembler.size).toBe(4)
    })
})
