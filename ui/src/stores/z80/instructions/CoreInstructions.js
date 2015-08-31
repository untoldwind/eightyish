import Instruction from './Instruction'
import Transition from '../Transition'

import { HALT, NOP } from './constants'

class Halt extends Instruction {
    constructor() {
        super(0x76, 4, HALT, [])
    }

    process() {
        return null
    }
}

class Nop extends Instruction {
    constructor() {
        super(0x00, 4, NOP, [])
    }

    process(state) {
        return new Transition({PC: state.registers.PC + 1})
    }
}

export default [
    new Nop(),
    new Halt()
]
