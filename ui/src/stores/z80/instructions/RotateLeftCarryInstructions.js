import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions } from './factory'

import { ROTLC, POINTER_HL, POINTER_IX, POINTER_IY } from './constants'

function operation(storer, first, carry) {
    const result = (first << 1) | (carry ? 0x1 : 0x0)

    return storer(result).withFlags(result).withCarry((first & 0x80) !== 0)
}

function create(opcode, cycles, target) {
    return new GenericInstruction(opcode, cycles, ROTLC, [target], operation)
}

export const name = ROTLC
export const description = 'Rotate target left with carry flag: ROTLC target'
export const instructions = [
    create(0xcb16, 15, POINTER_HL),
    create(0xddcb16, 23, POINTER_IX),
    create(0xfdcb16, 23, POINTER_IY)
].concat(createFromRegisterInstructions(0xcb10, (opcode, register) => create(opcode, 8, register)))
