import GenericInstruction from './GenericInstruction'

import Transition from '../Transition'

class Halt extends GenericInstruction {
    constructor() {
        super(0x76, 'HALT', [])
    }

    process() {
        return null
    }
}

class Nop extends GenericInstruction {
    constructor() {
        super(0x00, 'NOP', [])
    }

    process(state) {
        return new Transition({PC: state.registers.PC + 1})
    }
}

export default [
    new Nop(),
    new Halt()
]
