jest.autoMockOff()

const matchers = require('./matchers')
const WordPointerArgument = require('../WordPointerArgument')

describe('WordPointerArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(WordPointerArgument).toBeValidArgument()
    })

    it('should match only addresses and labels', () => {
        expect(WordPointerArgument.matches('(0xabcd)')).toBe(true)
        expect(WordPointerArgument.matches('(.label)')).toBe(true)
        expect(WordPointerArgument.matches('(123456)')).toBe(false)
        expect(WordPointerArgument.matches('0xabcd')).toBe(false)
        expect(WordPointerArgument.matches('.label')).toBe(false)
    })

    it('should extract values from matches', () => {
        expect(WordPointerArgument.extractValue('(0xabcd)')).toBe(0xabcd)
        expect(WordPointerArgument.extractValue('(.label)')).toBe('.label')
    })

    it('should format value to canonical form', () => {
        expect(WordPointerArgument.formatValue(0xabcd)).toBe('(0xabcd)')
        expect(WordPointerArgument.formatValue('.label')).toBe('(.label)')
    })

    it('should create extra opcodes', () => {
        expect(WordPointerArgument.extraSize).toBe(2)
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0xab, 0xcd])
        }

        expect(WordPointerArgument.extraOpcodes('.label', labels)).toEqual([0xab, 0xcd])
        expect(labels.getAddress).toBeCalledWith('.label')
    })

    it('should have a good example', () => {
        expect(WordPointerArgument.example).toBe('(address)')
    })

    it('should load a word from a memory address', () => {
        const state = {
            getMemoryWord: jest.genMockFunction().mockReturnValue(0x1234)
        }
        const result = WordPointerArgument.loader(state, [0xab, 0xcd])

        expect(result).toBe(0x1234)
        expect(state.getMemoryWord).toBeCalledWith(0xabcd)
    })

    it('should create a storer that writes a word to a memory address', () => {
        const storer = WordPointerArgument.storer(null, [0xab, 0xcd])

        expect(typeof storer).toBe('function')

        const transition = storer(0x1234)

        expect(transition).toBeDefined()
        expect(transition.memoryOffset).toBe(0xabcd)
        expect(transition.newMemoryData).toEqual([0x12, 0x34])
    })
})
