import {RegisterArgument} from './Arguments'

export function createFromRegisterInstructions(base, callback) {
    const result = []

    for (let i = 0; i < 5; i++) {
        result.push(callback(base + ((i - 1) & 0x7), RegisterArgument(String.fromCharCode(65 + i))))
    }
    return result
}

export function createToRegisterInstructions(base, callback) {
    const result = []

    for (let i = 0; i < 5; i++) {
        result.push(callback(base + (((i - 1) & 0x7) << 3), RegisterArgument(String.fromCharCode(65 + i))))
    }
    return result
}
