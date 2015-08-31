jest.autoMockOff()

const matchers = require('./matchers')
const WordValueArgument = require('../WordValueArgument')
const Transition = require('../../Transition')

describe('WordValueArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(WordValueArgument).toBeValidArgument()
    })

    it('should match only word values and labels', () => {
        expect(WordValueArgument.matches('123')).toBe(true)
        expect(WordValueArgument.matches('0xab')).toBe(true)
        expect(WordValueArgument.matches('70000')).toBe(false)
        expect(WordValueArgument.matches('.label')).toBe(true)
        expect(WordValueArgument.matches('abc')).toBe(false)
    })

    it('should extract values from matches', () => {
        expect(WordValueArgument.extractValue('0xabcd')).toBe(0xabcd)
        expect(WordValueArgument.extractValue('.label')).toBe('.label')
    })

    it('should format value to canonical form', () => {
        expect(WordValueArgument.formatValue(0xabcd)).toBe('0xabcd')
        expect(WordValueArgument.formatValue('.label')).toBe('.label')
    })

    it('should create extra opcodes', () => {
        expect(WordValueArgument.extraSize).toBe(2)
        const labels = {
            getAddress: jest.genMockFunction().mockReturnValue([0xab, 0xcd])
        }

        expect(WordValueArgument.extraOpcodes('.label', labels)).toEqual([0xab, 0xcd])
        expect(labels.getAddress).toBeCalledWith('.label')
    })

    it('should have a good example', () => {
        expect(WordValueArgument.example).toBe('address')
    })

    it('should load word value directly', () => {
        const result = WordValueArgument.loader(null, [0xab, 0xcd])

        expect(result).toBe(0xabcd)
    })

    it('should create a storer with an empty transition', () => {
        const storer = WordValueArgument.storer(null, [0xab])

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toEqual(new Transition())
    })
})
