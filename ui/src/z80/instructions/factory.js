import { REG_A, REG_B, REG_C, REG_D, REG_E, REG_H, REG_L,
    POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

const registers = [REG_B, REG_C, REG_D, REG_E, REG_H, REG_L, POINTER_HL, REG_A]

export function createFromRegisterInstructions(base, callback) {
    const result = []

    for (let i = 0; i < 8; i++) {
        if (i === 6) {
            continue
        }
        result.push(callback(base + i, registers[i]))
    }
    return result
}


export function createFromWithPointers(base, callback) {
    const result = []

    for (let i = 0; i < 8; i++) {
        result.push(callback(base + i, registers[i]))
    }
    result.push(callback(base + 0xdd06, POINTER_IX))
    result.push(callback(base + 0xfd06, POINTER_IY))
    return result
}

export function createToRegisterInstructions(base, callback) {
    const result = []

    for (let i = 0; i < 8; i++) {
        if (i === 6) {
            continue
        }
        result.push(callback(base + (i << 3), registers[i]))
    }
    return result
}

export function createToWithPointers(base, extraCyclesHL, extraCyclesJX, callback) {
    const result = []

    for (let i = 0; i < 8; i++) {
        let instruction = callback(base + (i << 3), registers[i])
        if (i === 6) {
            instruction.cycles += extraCyclesHL
        }
        result.push(instruction)
    }
    let instruction = callback(base + 0xdd06, POINTER_IX)
    instruction.cycles += extraCyclesJX
    result.push(instruction)
    instruction = callback(base + 0xfd06, POINTER_IY)
    instruction.cycles += extraCyclesJX
    result.push(instruction)

    return result
}
