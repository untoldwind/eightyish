jest.autoMockOff()

const matchers = require('./matchers')
const ConditionArgument = require('../ConditionArgument')
const Transition = require('../../Transition')

describe('ConditionArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(ConditionArgument('Z', false)).toBeValidArgument()
    })

    it('should match only exact condition', () => {
        expect(ConditionArgument('Z', false).matches('NZ')).toBe(true)
        expect(ConditionArgument('Z', false).matches('Z')).toBe(false)
        expect(ConditionArgument('C', false).matches('NZ')).toBe(false)
        expect(ConditionArgument('Z', true).matches('Z')).toBe(true)
    })

    it('should not extract any values', () => {
        expect(ConditionArgument('Z', false).extractValue()).toBeNull()
    })

    it('should format to canonical form', () => {
        expect(ConditionArgument('Z', false).formatValue()).toBe('NZ')
        expect(ConditionArgument('C', false).formatValue()).toBe('NC')
        expect(ConditionArgument('Z', true).formatValue()).toBe('Z')
    })

    it('should not create extra opcodes', () => {
        expect(ConditionArgument('Z', false).extraSize).toBe(0)
        expect(ConditionArgument('Z', false).extraOpcodes()).toEqual([])
    })

    it('should have a good example', () => {
        expect(ConditionArgument('Z', false).example).toBe('NZ')
        expect(ConditionArgument('C', false).example).toBe('NC')
        expect(ConditionArgument('Z', true).example).toBe('Z')
    })

    it('should load a boolean depending on actual flags', () => {
        const state = {
            registers: {
                flagC: true,
                flagZ: false
            }
        }

        expect(ConditionArgument('Z', false).loader(state)).toBe(true)
        expect(ConditionArgument('Z', true).loader(state)).toBe(false)
        expect(ConditionArgument('C', false).loader(state)).toBe(false)
        expect(ConditionArgument('C', true).loader(state)).toBe(true)
    })

    it('should create a storer with an empty transition', () => {
        const storer = ConditionArgument('Z', false).storer()

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toEqual(new Transition())
    })
})
