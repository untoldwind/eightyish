import Transition from '../Transition'

export default {
    matches: (value) => {
        if (value.startsWith('(.') && value.endsWith(')')) {
            return true
        }
        if (value.startsWith('(') && value.endsWith(')')) {
            const w = parseInt(value.substring(1, value.length - 1))

            return typeof w === 'number' && w >= 0 && w <= 65355
        }
        return false
    },
    extractValue: (value) => {
        if (value.startsWith('(.') && value.endsWith(')')) {
            return value.substring(1, value.length - 1)
        }
        if (value.startsWith('(') && value.endsWith(')')) {
            return parseInt(value.substring(1, value.length - 1))
        }
        return 0
    },
    formatValue: (value) => {
        if (typeof value === 'number') {
            return `(0x${value.toString(16)})`
        }
        return `(${value})`
    },
    extraOpcodes: (value, labels) => labels.getAddress(value),
    extraSize: 2,
    example: '(address)',
    loader: (state, pcMem) => {
        const address = (pcMem[0] << 8) | pcMem[1]

        return state.getMemoryByte(address)
    },
    storer: (state, pcMem) => {
        const address = (pcMem[0] << 8) | pcMem[1]

        return (result) => new Transition().withByteAt(address, result)
    }
}
