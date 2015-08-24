import Transition from '../Transition'

export default function (flag, condition) {
    const formatted = (condition ? '' : 'N') + flag

    return {
        matches: (value) => value.toUpperCase() === formatted,
        extractValue: () => null,
        formatValue: () => formatted,
        extraOpcodes: () => [],
        extraSize: 0,
        example: formatted,
        loader: (state) => state.registers['flag' + flag] === condition,
        storer: () => () => new Transition()
    }
}
