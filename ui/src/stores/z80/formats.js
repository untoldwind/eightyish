export function fill(prefix, upTo) {
    let result = ''

    for (let i = prefix.length; i < upTo; i++) {
        result += ' '
    }

    return result
}
