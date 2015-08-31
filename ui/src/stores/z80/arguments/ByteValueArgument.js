import Transition from '../Transition'

export default {
    matches: (value) => {
        const b = parseInt(value)

        return typeof b === 'number' && b >= 0 && b <= 255
    },
    extractValue: (value) => parseInt(value),
    formatValue: (value) => value.toString(10),
    extraOpcodes: (value) => [value & 0xff],
    extraSize: 1,
    example: 'num',
    loader: (state, pcMem) => pcMem[0],
    storer: () => () => new Transition()
}
