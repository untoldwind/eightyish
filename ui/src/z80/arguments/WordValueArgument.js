import Transition from '../Transition'

export default {
    matches: (value) => {
        if (value.startsWith('.')) {
            return true
        }
        const w = parseInt(value)

        return typeof w === 'number' && w >= 0 && w <= 65355
    },
    extractValue: (value) => value.startsWith('.') ? value : parseInt(value),
    formatValue: (value) => {
        if (typeof value === 'number') {
            return `0x${value.toString(16)}`
        }
        return value
    },
    extraOpcodes: (value, labels) => labels.getAddress(value),
    extraSize: 2,
    example: 'address',
    loader: (state, pcMem) => (pcMem[0] << 8) | pcMem[1],
    storer: () => () => new Transition()
}
