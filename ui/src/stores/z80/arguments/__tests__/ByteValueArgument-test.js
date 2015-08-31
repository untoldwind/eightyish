jest.autoMockOff()

const matchers = require('./matchers')
const ByteValueArgument = require('../ByteValueArgument')
const Transition = require('../../Transition')

describe('ByteValueArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(ByteValueArgument).toBeValidArgument()
    })

    it('should match only byte values', () => {
        expect(ByteValueArgument.matches('123')).toBe(true)
        expect(ByteValueArgument.matches('0xab')).toBe(true)
        expect(ByteValueArgument.matches('1234')).toBe(false)
        expect(ByteValueArgument.matches('abcd')).toBe(false)
    })

    it('should extract value from matches', () => {
        expect(ByteValueArgument.extractValue('123')).toBe(123)
        expect(ByteValueArgument.extractValue('0xab')).toBe(0xab)
    })

    it('should format value to canonical form', () => {
        expect(ByteValueArgument.formatValue(123)).toBe('123')
    })

    it('should create extra opcodes', () => {
        expect(ByteValueArgument.extraSize).toBe(1)
        expect(ByteValueArgument.extraOpcodes(0xab)).toEqual([0xab])
    })

    it('should have a good example', () => {
        expect(ByteValueArgument.example).toBe('num')
    })

    it('should load byte value directly', () => {
        const result = ByteValueArgument.loader(null, [0xab])

        expect(result).toBe(0xab)
    })

    it('should create a storer with an empty transition', () => {
        const storer = ByteValueArgument.storer(null, [0xab])

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toEqual(new Transition())
    })
})
