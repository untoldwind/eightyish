export function RegisterPattern(register) {
    return {
        matches: (value) => value.toUpperCase() === register,
        extractValue: () => null,
        formatValue: () => register,
        extraOpcodes: () => [],
        extraSize: 0
    }
}

export function RegisterPointerPattern(register) {
    return {
        matches: (value) => value.toUpperCase() === `(${register})`,
        extractValue: () => null,
        formatValue: () => `(${register})`,
        extraOpcodes: () => [],
        extraSize: 0
    }
}

export function ConditionPattern(flag, condition) {
    const formatted = (condition ? '' : 'N') + flag

    return {
        matches: (value) => value.toUpperCase() === formatted,
        extractValue: () => null,
        formatValue: () => formatted,
        extraOpcodes: () => [],
        extraSize: 0
    }
}

export const ByteValuePattern = {
    matches: (value) => {
        const b = parseInt(value)

        return typeof b === 'number' && b >= 0 && b <= 255
    },
    extractValue: (value) => parseInt(value),
    formatValue: (value) => value.toString(10),
    extraOpcodes: (value) => [value & 0xff],
    extraSize: 1
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
    extraSize: 2
}

export const AddressOrLabelPattern = {
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
    extraSize: 2
}


export function IndexPointerPattern(indexRegister) {
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
        extraSize: 1
    }
}
