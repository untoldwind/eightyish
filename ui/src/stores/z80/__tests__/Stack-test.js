jest.autoMockOff()

const Stack = require('../Stack')

describe('Stack', () => {
    it('should support peek on empty', () => {
        const stack = Stack.create()

        expect(stack.peek()).toBeNull()
    })

    it('should support pop on empty', () => {
        const stack = Stack.create()

        expect(stack.pop()).toBe(stack)
    })

    it('should support push/peek/pop', () => {
        const stack = Stack.create()
        const nextStack = stack.push('first')
        const nextNextStack = nextStack.push('second')

        expect(nextStack).not.toBe(stack)
        expect(nextNextStack).not.toBe(nextStack)
        expect(nextStack.peek()).toBe('first')
        expect(nextNextStack.peek()).toBe('second')

        const prevStack = nextNextStack.pop()
        expect(prevStack).not.toBe(nextNextStack)
        expect(prevStack.peek()).toBe('first')
    })
})
