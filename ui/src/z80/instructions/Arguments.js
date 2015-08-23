import Transition from '../Transition'

export function RegisterArgument(register) {
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

export function RegisterBytePointerArgument(register) {
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

function signedByte(value) {
    return value < 0x80 ? value : value - 0x100
}

export function IndexRegisterBytePointerPattern(indexRegister) {
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

export function ConditionArgument(flag, condition) {
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

export const ByteValueArgument = {
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

export const PointerPattern = {
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

        return () => new Transition().withByteAt(address, result)
    }

}

export const AddressOrLabelArgument = {
    matches: (value) => {
        if (value.startsWith('.')) {
            return true
        }
        const w = parseInt(value)

        return typeof w === 'number' && w >= 0 && w <= 65355
    },
    extractValue: (value) => value,
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
