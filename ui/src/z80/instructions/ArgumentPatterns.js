export function RegisterPattern(register) {
    return {
        matches: (value) => value.toUpperCase() === register,
        extractValue: () => register
    }
}

export function RegisterPointerPattern(register) {
    return {
        matches: (value) => value.toUpperCase() === `(${register})`,
        extractValue: () => `(${register})`
    }
}

export const ByteValuePattern = {
    matches(value) {
        const b = parseInt(value)

        return typeof b === 'number' && b >= 0 && b <= 255
    },

    extractValue(value) {
        return parseInt(value)
    }
}

export const WordValuePattern = {
    matches(value) {
        const w = parseInt(value)

        return typeof w === 'number' && w >= 0 && w <= 65355
    }
}

export const PointerPattern = {
    matches(value) {
        if (value.startsWith('(.') && value.endsWith(')')) {
            return true
        }
        if (value.startsWith('(') && value.endsWith(')')) {
            const w = parseInt(value.substring(1, value.length - 1))

            return typeof w === 'number' && w >= 0 && w <= 65355
        }
        return false
    },

    extractValue(value) {
        if (value.startsWith('(.') && value.endsWith(')')) {
            return value.substring(1, value.length - 1)
        }
        if (value.startsWith('(') && value.endsWith(')')) {
            return parseInt(value.substring(1, value.length - 1))
        }
        return 0
    }
}

export const AddressOrLabelPattern = {
    matches(value) {
        if (value.startsWith('.')) {
            return true
        }
        const w = parseInt(value)

        return typeof w === 'number' && w >= 0 && w <= 65355
    }
}

export function IndexPointerPattern(indexRegister) {
    const pattern = new RegExp(`\\(${indexRegister}([\\-\\+]\\d+)\\)`, 'i')

    return {
        matches: (value) => value.match(pattern),
        extractValue: (value) => value.match(pattern)[1]
    }
}
