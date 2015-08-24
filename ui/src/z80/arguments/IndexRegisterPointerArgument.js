import Transition from '../Transition'

function signedByte(value) {
    return value < 0x80 ? value : value - 0x100
}

export default function(indexRegister) {
    const pattern = new RegExp(`\\(${indexRegister}([\\-\\+]\\d+)\\)`, 'i')

    return {
        matches: (value) => value.match(pattern),
        extractValue: (value) => parseInt(value.match(pattern)[1], 10),
        formatValue: (value) => {
            if (value < 0) {
                return `(${indexRegister}${value.toString(10)})`
            }
            return `(${indexRegister}+${value.toString(10)})`
        },
        extraOpcodes: (value) => [value & 0xff],
        extraSize: 1,
        example: `(${indexRegister}+num)`,
        loader: (state, pcMem) => {
            const address = state.registers[indexRegister] + signedByte(pcMem[0])

            return state.getMemoryByte(address)
        },
        storer: (state, pcMem) => {
            const address = state.registers[indexRegister] + signedByte(pcMem[0])

            return (result) => new Transition().withByteAt(address, result)
        }
    }
}
