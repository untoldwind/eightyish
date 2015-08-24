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
})
