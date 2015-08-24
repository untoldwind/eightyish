import Transition from '../Transition'

export default function(register) {
    return {
        matches: (value) => value.toUpperCase() === `(${register})`,
        extractValue: () => null,
        formatValue: () => `(${register})`,
        extraOpcodes: () => [],
        extraSize: 0,
        example: `(${register})`,
        loader: (state) => {
            const address = state.registers[register]

            return state.getMemoryByte(address)
        },
        storer: (state) => {
            const address = state.registers[register]

            return (result) => new Transition().withByteAt(address, result)
        }
    }
}
