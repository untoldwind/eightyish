jest.autoMockOff()

const Typewriter = require('../Typewriter')

describe('Transition', () => {
    it('should support regular chars', () => {
        const typewriter = Typewriter.create()
        const single = typewriter.output(65)
        const mutliple = single.output(66).output(67).output(68)

        expect(single.lines).toEqual(['A'])
        expect(single.position).toBe(1)
        expect(mutliple.lines).toEqual(['ABCD'])
        expect(mutliple.position).toBe(4)
    })

    it('should support line feed', () => {
        const typewriter = Typewriter.create().output(65).output(66).output(67).output(68)
        const result = typewriter.output(10).output(69)

        expect(result.lines).toEqual(['ABCD', '    E'])
        expect(result.position).toBe(5)
    })

    it('should support carriage return', () => {
        const typewriter = Typewriter.create().output(65).output(66).output(67).output(68)
        const result = typewriter.output(13).output(69)

        expect(result.lines).toEqual(['EBCD'])
        expect(result.position).toBe(1)
    })

    it('should support carriage return line feed', () => {
        const typewriter = Typewriter.create().output(65).output(66).output(67).output(68)
        const result = typewriter.output(13).output(10).output(69)

        expect(result.lines).toEqual(['ABCD', 'E'])
        expect(result.position).toBe(1)
    })

    it('should ignore non-ascii-7', () => {
        const typewriter = Typewriter.create()

        expect(typewriter.output(128)).toBe(typewriter)
        expect(typewriter.output(-1)).toBe(typewriter)
    })
})
