import Transition from '../Transition'

export default function (register) {
    if (register.length > 1) {
        return {
            matches: (value) => value.toUpperCase() === register,
            extractValue: () => null,
            formatValue: () => register,
            extraOpcodes: () => [],
            extraSize: 0,
            example: register,
            loader: (state) => state.registers[register],
            storer: () => (result) => new Transition().withWordRegister(register, result)
        }
    }
    return {
        matches: (value) => value.toUpperCase() === register,
        extractValue: () => null,
        formatValue: () => register,
        extraOpcodes: () => [],
        extraSize: 0,
        example: register,
        loader: (state) => state.registers[register],
        storer: () => (result) => new Transition().withByteRegister(register, result)
    }
}
