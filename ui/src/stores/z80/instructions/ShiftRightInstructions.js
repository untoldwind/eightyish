import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { SHR, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

function operation(storer, first) {
    const result = first >> 1

    return storer(result).withFlags(result).withCarry((first & 0x1) !== 0)
}

function create(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, SHR, [target], operation)
}

export const name = SHR
export const description = 'Shift target right, lowest bit goes to carry: SHR target'
export const instructions = [
    create(0xcb3e, 15, POINTER_HL),
    create(0xddcb3e, 23, POINTER_IX),
    create(0xfdcb3e, 23, POINTER_IY)
].concat(createFromRegisterInstructions(0xcb38, (opcode, register) => create(opcode, 8, register)))
