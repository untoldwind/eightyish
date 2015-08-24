jest.autoMockOff()

const matchers = require('./matchers')
const RegisterPointerArgument = require('../RegisterPointerArgument')

describe('RegisterPointerArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(RegisterPointerArgument('HL')).toBeValidArgument()
    })

    it('should match pointer expressions', () => {
        const hl = RegisterPointerArgument('HL')

        expect(hl.matches('(HL)')).toBe(true)
        expect(hl.matches('(IX)')).toBe(false)
        expect(hl.matches('(12)')).toBe(false)
        expect(hl.matches('HL')).toBe(false)
    })

    it('should not extract any values', () => {
        expect(RegisterPointerArgument('HL').extractValue()).toBeNull()
    })

    it('should format to canonical form', () => {
        expect(RegisterPointerArgument('HL').formatValue()).toBe('(HL)')
    })

    it('should not create extra opcodes', () => {
        expect(RegisterPointerArgument('HL').extraSize).toBe(0)
        expect(RegisterPointerArgument('HL').extraOpcodes()).toEqual([])
    })

    it('should have a good example', () => {
        expect(RegisterPointerArgument('HL').example).toBe('(HL)')
    })

    it('should load a byte from pointed memory address', () => {
        const state = {
            registers: {
                HL: 0xabcd
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0xde)
        }
        const result = RegisterPointerArgument('HL').loader(state)

        expect(result).toBe(0xde)
        expect(state.getMemoryByte).toBeCalledWith(0xabcd)
    })

    it('should create a storer that writes a byte to pointed memory address', () => {
        const state = {
            registers: {
                HL: 0xabcd
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0xde)
        }
        const storer = RegisterPointerArgument('HL').storer(state)

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toBeDefined()
        expect(transition.memoryOffset).toBe(0xabcd)
        expect(transition.newMemoryData).toEqual([0x12])
    })
})
