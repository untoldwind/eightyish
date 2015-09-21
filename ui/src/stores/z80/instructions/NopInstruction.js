import Instruction from './Instruction'
import Transition from '../Transition'

import { NOP } from './constants'

class Nop extends Instruction {
    constructor() {
        super(0x00, 4, NOP, [])
    }

    process(state) {
        return new Transition({PC: state.registers.PC + 1})
    }
}

export const name = NOP
export const description = 'No operation (i.e. do nothing): NOP'
export const instructions = [
    new Nop()
]
