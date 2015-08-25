import 'babel/polyfill'

jest.autoMockOff()

const InstructionSet = require('../InstructionSet')
const SourceLabels = require('../SourceLabels')

describe('InstructionSet', () => {
    it('should not have duplicate opcodes', () => {
        const byOpcode = new Map(InstructionSet.INSTRUCTIONS.map(i => [i.opcode, i]))

        expect(byOpcode.size).toBe(InstructionSet.INSTRUCTIONS.length)
    })

    it('should support blank assembler lines', () => {
        const blank = InstructionSet.createBlank()

        expect(blank).toBeDefined()
        expect(blank.type).toBe('blank')
        expect(blank.assembler).toBe('  ')
        expect(blank.opcodes(null)).toEqual([])
        expect(blank.size).toBe(0)
    })

    it('should support error assembler lines', () => {
        const error = InstructionSet.createError('error')

        expect(error).toBeDefined()
        expect(error.type).toBe('error')
        expect(error.opcodes(null)).toEqual([])
        expect(error.size).toBe(0)
    })

    it('should support label lines', () => {
        const labels = {
            setAddress: jest.genMockFunction()
        }
        const label = InstructionSet.createLabel('aLabel')

        expect(label).toBeDefined()
        expect(label.type).toBe('sourcelabel')
        expect(label.opcodes(null)).toEqual([])
        expect(label.size).toBe(0)

        label.updateLabel(0x1234, labels)
        expect(labels.setAddress).toBeCalledWith('aLabel', 0x1234)
    })

    it('should create valid instructions', () => {
        const labels = new SourceLabels()
        let assembler

        assembler = InstructionSet.createInstruction([])
        expect(assembler).toBeNull()

        assembler = InstructionSet.createInstruction(['something'])
        expect(assembler).toBeNull()

        assembler = InstructionSet.createInstruction(['LOAD', 'G', 'I'])
        expect(assembler).toBeNull()

        assembler = InstructionSet.createInstruction(['LOAD', 'A', 'B'])
        expect(assembler.opcodes(labels)).toEqual([0x78])

        assembler = InstructionSet.createInstruction(['LOAD', 'BC', '(0xabcd)'])
        expect(assembler.opcodes(labels)).toEqual([0xed, 0x4b, 0xab, 0xcd])

        assembler = InstructionSet.createInstruction(['ADD', 'A', 'C'])
        expect(assembler.opcodes(labels)).toEqual([0x81])

        assembler = InstructionSet.createInstruction(['SUB', 'A', '(IX+3)'])
        expect(assembler.opcodes(labels)).toEqual([0xdd, 0x96, 0x03])

        assembler = InstructionSet.createInstruction(['INC', 'C'])
        expect(assembler.opcodes(labels)).toEqual([0x0c])
    })

    it('should parse lines', () => {
        const labels = new SourceLabels()
        let assembler

        assembler = InstructionSet.parseLine('load a, c')
        expect(assembler.opcodes(labels)).toEqual([0x79])

        assembler = InstructionSet.parseLine('LOAD b <- (hl)')
        expect(assembler.opcodes(labels)).toEqual([0x46])

        assembler = InstructionSet.parseLine('')
        expect(assembler.type).toBe('blank')

        assembler = InstructionSet.parseLine('.alabel:')
        expect(assembler.type).toBe('sourcelabel')

        assembler = InstructionSet.parseLine('something')
        expect(assembler.type).toBe('error')
    })

    it('should process byte opcodes', () => {
        const state = {
            registers: {
                PC: 0x1234,
                A: 0,
                B: 13
            },
            getMemory: jest.genMockFunction().mockReturnValue([0x78])
        }

        const transition = InstructionSet.process(state)
        expect(transition).toBeDefined()
        expect(transition.newRegisters).toEqual({
            A: 13,
            PC: 0x1235
        })
        expect(transition.newFlags).toEqual({
            C: false,
            P: true,
            S: false,
            Z: false
        })
        expect(state.getMemory).toBeCalledWith(0x1234, 4)
    })

    it('should not process unknown byte opcodes', () => {
        const state = {
            registers: {
                PC: 0x1234
            },
            getMemory: jest.genMockFunction().mockReturnValue([0xff])
        }

        const transition = InstructionSet.process(state)
        expect(transition).toBeNull()
        expect(state.getMemory).toBeCalledWith(0x1234, 4)
    })

    it('should process word opcodes', () => {
        const state = {
            registers: {
                PC: 0x1234,
                SP: 0x2345,
                IX: 0xabcd
            },
            getMemory: jest.genMockFunction().mockReturnValue([0xdd, 0xe5])
        }

        const transition = InstructionSet.process(state)
        expect(transition).toBeDefined()
        expect(transition.newRegisters).toEqual({
            PC: 0x1236,
            SP: 0x2343
        })
        expect(transition.memoryOffset).toBe(0x2343)
        expect(transition.newMemoryData).toEqual([0xab, 0xcd])
        expect(state.getMemory).toBeCalledWith(0x1234, 4)
    })

    it('should not process unknown word opcodes', () => {
        const state = {
            registers: {
                PC: 0x1234
            },
            getMemory: jest.genMockFunction().mockReturnValue([0xdd])
        }

        const transition = InstructionSet.process(state)
        expect(transition).toBeNull()
        expect(state.getMemory).toBeCalledWith(0x1234, 4)
    })
})
