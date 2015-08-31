jest.autoMockOff()

const matchers = require('./matchers')
const IndexRegisterPointerArgument = require('../IndexRegisterPointerArgument')

describe('IndexRegisterPointerArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(IndexRegisterPointerArgument('IX')).toBeValidArgument()
    })

    it('should match index pointer expressions', () => {
        const ix = IndexRegisterPointerArgument('IX')

        expect(ix.matches('(IX+10)')).toBe(true)
        expect(ix.matches('(IX-10)')).toBe(true)
        expect(ix.matches('(IX)')).toBe(false)
        expect(ix.matches('(IY+10)')).toBe(false)
        expect(ix.matches('IX+10')).toBe(false)
    })

    it('should extract values from matches', () => {
        const ix = IndexRegisterPointerArgument('IX')

        expect(ix.extractValue('(IX+10)')).toBe(10)
        expect(ix.extractValue('(IX-10)')).toBe(-10)
    })

    it('should format values to canonical form', () => {
        const ix = IndexRegisterPointerArgument('IX')

        expect(ix.formatValue(10)).toBe('(IX+10)')
        expect(ix.formatValue(-10)).toBe('(IX-10)')
    })

    it('should create extra opcodes', () => {
        expect(IndexRegisterPointerArgument('IX').extraSize).toBe(1)
        expect(IndexRegisterPointerArgument('IX').extraOpcodes(0xab)).toEqual([0xab])
    })

    it('should have a good example', () => {
        expect(IndexRegisterPointerArgument('IX').example).toBe('(IX+num)')
    })

    it('should load a byte from pointed memory address', () => {
        const state = {
            registers: {
                IX: 0xabcd
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0xde)
        }
        let result = IndexRegisterPointerArgument('IX').loader(state, [0x12])

        expect(result).toBe(0xde)
        expect(state.getMemoryByte).toBeCalledWith(0xabdf)

        state.getMemoryByte.mockClear()
        result = IndexRegisterPointerArgument('IX').loader(state, [-3 & 0xff])

        expect(result).toBe(0xde)
        expect(state.getMemoryByte).toBeCalledWith(0xabca)
    })

    it('should create a storer that writes a byte to pointed memory address', () => {
        const state = {
            registers: {
                IX: 0xabcd
            },
            getMemoryByte: jest.genMockFunction().mockReturnValue(0xde)
        }
        const storer = IndexRegisterPointerArgument('IX').storer(state, [0x12])

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toBeDefined()
        expect(transition.memoryOffset).toBe(0xabdf)
        expect(transition.newMemoryData).toEqual([0x12])
    })
})
