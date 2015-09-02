export function repeat(ch, count) {
    return new Array(count + 1).join(ch)
}

export function fill(prefix, upTo) {
    return repeat(' ', upTo - prefix.length)
}

export function byte2bin(v) {
    if (typeof v !== 'number') {
        return ''
    }
    const bin = v.toString(2)

    return repeat('0', 8 - bin.length) + bin
}

export function byte2hex(v) {
    if (typeof v !== 'number') {
        return ''
    }
    const hex = v.toString(16)

    return repeat('0', 2 - hex.length) + hex
}

export function byteParser(callback) {
    return (str) => {
        let newValue

        if (str.startsWith('0b')) {
            newValue = parseInt(str.slice(2), 2)
        } else if (str.startsWith('0x')) {
            newValue = parseInt(str.slice(2), 16)
        } else {
            newValue = parseInt(str)
        }
        if (typeof newValue === 'number' && newValue >= 0 && newValue <= 255) {
            callback(newValue)
        }
    }
}

export function word2hex(v) {
    if (typeof v !== 'number') {
        return ''
    }
    const hex = v.toString(16)

    return repeat('0', 4 - hex.length) + hex
}

export function wordParser(callback) {
    return (str) => {
        let newValue

        if (str.startsWith('0b')) {
            newValue = parseInt(str.slice(2), 2)
        } else if (str.startsWith('0x')) {
            newValue = parseInt(str.slice(2), 16)
        } else {
            newValue = parseInt(str)
        }
        if (typeof newValue === 'number' && newValue >= 0 && newValue <= 65355) {
            callback(newValue)
        }
    }
}
