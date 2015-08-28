jest.autoMockOff()

const RotateLeftCarryInstructions = require('../RotateLeftCarryInstructions')
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
                flags: {
                    C: false
                }
            }
        }
        const transition = decA.process(state, [0xcb, 0x17])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1236)
        expect(transition.newRegisters.A).toBe(0x6)
        expect(transition.newFlags.C).toBe(true)
        expect(transition.newFlags.S).toBe(false)
        expect(transition.newFlags.P).toBe(false)
        expect(transition.newFlags.Z).toBe(false)

        const assembler = decA.createStatement([null])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ROTLC\tA')
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
                flags: {
                    C: true
                }
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x41)
        }
        const transition = decA.process(state, [0xdd, 0xcb, 0x2, 0x16])

        expect(transition).toBeDefined()
        expect(transition.newRegisters.PC).toBe(1238)
        expect(transition.newFlags.C).toBe(false)
        expect(transition.newFlags.S).toBe(true)
        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.Z).toBe(false)
        expect(transition.memoryOffset).toBe(0xabcf)
        expect(transition.newMemoryData).toEqual([0x83])
        expect(state.getMemoryByte).toBeCalledWith(0xabcf)

        const assembler = decA.createStatement([10])

        expect(assembler).toBeDefined()
        expect(assembler.type).toBe('instruction')
        expect(assembler.assembler).toBe('ROTLC\t(IX+10)')
        expect(assembler.opcodes(null)).toEqual([0xdd, 0xcb, 0xa, 0x16])
        expect(assembler.size).toBe(4)
    })
})
