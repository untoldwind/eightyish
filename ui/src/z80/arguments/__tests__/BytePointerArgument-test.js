jest.autoMockOff()

const matchers = require('./matchers')
const BytePointerArgument = require('../BytePointerArgument')

describe('BytePointerArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(BytePointerArgument).toBeValidArgument()
    })

    it('should match only addresses and labels', () => {
        expect(BytePointerArgument.matches('(0xabcd)')).toBe(true)
        expect(BytePointerArgument.matches('(.label)')).toBe(true)
        expect(BytePointerArgument.matches('(123456)')).toBe(false)
        expect(BytePointerArgument.matches('0xabcd')).toBe(false)
        expect(BytePointerArgument.matches('.label')).toBe(false)
    })

    it('should extract values from matches', () => {
        expect(BytePointerArgument.extractValue('(0xabcd)')).toBe(0xabcd)
        expect(BytePointerArgument.extractValue('(.label)')).toBe('.label')
    })

    it('should format value to canonical form', () => {
        expect(BytePointerArgument.formatValue(0xabcd)).toBe('(0xabcd)')
        expect(BytePointerArgument.formatValue('.label')).toBe('(.label)')
    })

    it('should create extra opcodes', () => {
        expect(BytePointerArgument.extraSize).toBe(2)
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0xab, 0xcd])
        }

        expect(BytePointerArgument.extraOpcodes('.label', labels)).toEqual([0xab, 0xcd])
        expect(labels.getAddress).toBeCalledWith('.label')
    })

    it('should have a good example', () => {
        expect(BytePointerArgument.example).toBe('(address)')
    })

    it('should load a byte from a memory address', () => {
        const state = {
            getMemoryByte: jest.genMockFunction().mockReturnValue(0x12)
        }
        const result = BytePointerArgument.loader(state, [0xab, 0xcd])

        expect(result).toBe(0x12)
        expect(state.getMemoryByte).toBeCalledWith(0xabcd)
    })

    it('should create a storer that writes a byte to a memory address', () => {
        const storer = BytePointerArgument.storer(null, [0xab, 0xcd])

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toBeDefined()
        expect(transition.memoryOffset).toBe(0xabcd)
        expect(transition.newMemoryData).toEqual([0x12])
    })
})
