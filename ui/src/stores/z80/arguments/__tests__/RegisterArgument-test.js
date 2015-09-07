jest.autoMockOff()

const matchers = require('./matchers')
const RegisterArgument = require('../RegisterArgument')

describe('RegisterArgument', () => {
    beforeEach(() => {
        jest.addMatchers(matchers)
    })

    it('should be a valid argument', () => {
        expect(RegisterArgument('A')).toBeValidArgument()
        expect(RegisterArgument('AF')).toBeValidArgument()
    })

    it('should match only exact condition', () => {
        expect(RegisterArgument('A').matches('A')).toBe(true)
        expect(RegisterArgument('A').matches('Z')).toBe(false)
        expect(RegisterArgument('AF').matches('AF')).toBe(true)
        expect(RegisterArgument('AF').matches('BC')).toBe(false)
    })

    it('should extract no values', () => {
        expect(RegisterArgument('A').extractValue('A')).toBeNull()
        expect(RegisterArgument('AF').extractValue('A')).toBeNull()
    })

    it('should format value to canonical form', () => {
        expect(RegisterArgument('A').formatValue()).toBe('A')
        expect(RegisterArgument('AF').formatValue()).toBe('AF')
    })

    it('should create no extra opcodes', () => {
        expect(RegisterArgument('A').extraSize).toBe(0)
        expect(RegisterArgument('AF').extraSize).toBe(0)

        expect(RegisterArgument('A').extraOpcodes()).toEqual([])
        expect(RegisterArgument('AF').extraOpcodes()).toEqual([])
    })

    it('should have a good example', () => {
        expect(RegisterArgument('A').example).toBe('A')
        expect(RegisterArgument('AF').example).toBe('AF')
    })

    it('should load value from register', () => {
        const state = {
            registers: {
                A: 0x12,
                AF: 0x3456
            }
        }
        expect(RegisterArgument('A').loader(state)).toBe(0x12)
        expect(RegisterArgument('AF').loader(state)).toBe(0x3456)
    })

    it('should store value to byte register', () => {
        const storer = RegisterArgument('A').storer(null, [])

        expect(typeof storer).toBe('function')

        const transition = storer(0x12)

        expect(transition).toBeDefined()
        expect(transition.newRegisters.A).toBe(0x12)
    })

    it('should store value to word register', () => {
        const storer = RegisterArgument('AF').storer(null, [])

        expect(typeof storer).toBe('function')

        const transition = storer(0x3456)

        expect(transition).toBeDefined()
        expect(transition.newRegisters.AF).toBe(0x3456)
    })
})
