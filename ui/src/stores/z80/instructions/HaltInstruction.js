import Instruction from './Instruction'

import { HALT } from './constants'

class Halt extends Instruction {
    constructor() {
        super(0x76, 4, HALT, [])
    }

    process() {
        return null
    }
}

export const name = HALT
export const description = 'Halt operation (i.e. stop processing further): HALT'
export const instructions = [
    new Halt()
]
