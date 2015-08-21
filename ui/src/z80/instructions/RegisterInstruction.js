import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

export default class RegisterInstruction extends GenericInstruction {
    constructor(opcode, name, register, operation) {
        super(opcode, name, [args.RegisterPattern(register)])
        this.register = register
        this.byte = register.length === 1
        this.operation = operation
    }

    process(state) {
        const result = this.operation(state.registers[this.register], state)
        if (this.byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.register, result)
        }
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordRegister(this.register, result)
    }
}
