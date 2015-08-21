import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

class Push extends Instruction {
    constructor(opcode, register) {
        super(opcode, 'PUSH', [args.RegisterPattern(register)])
        this.register = register
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordRegister('SP', state.registers.SP - 2).
            withWordAt(state.registers.SP - 2, state.registers[this.register])
    }
}

class Pop extends Instruction {
    constructor(opcode, register) {
        super(opcode, 'POP', [args.RegisterPattern(register)])
        this.register = register
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordRegister('SP', state.registers.SP + 2).
            withWordRegister(this.register, state.getMemoryWord(state.registers.SP))
    }
}

export default [
    new Push(0xc5, 'BC'),
    new Push(0xd5, 'DE'),
    new Push(0xe5, 'HL'),
    new Push(0xf5, 'AF'),
    new Push(0xdde5, 'IX'),
    new Push(0xfdf5, 'IY'),
    new Pop(0xc1, 'BC'),
    new Pop(0xd1, 'DE'),
    new Pop(0xe1, 'HL'),
    new Pop(0xf1, 'AF'),
    new Pop(0xdde1, 'IX'),
    new Pop(0xfdf1, 'IY')
]
