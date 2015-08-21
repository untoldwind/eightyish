import TransferInstruction from './TransferInstruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

export default class RegisterToRegisterInstruction extends TransferInstruction {
    constructor(opcode, name, to, from, operation) {
        super(opcode, name, [args.RegisterPattern(to), args.RegisterPattern(from)])
        this.to = to
        this.from = from
        this.byte = to.length === 1
        this.operation = operation
    }

    process(state) {
        const result = this.operation(state.registers[this.to], state.registers[this.from])
        if (this.byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.to, result)
        }
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordRegister(this.to, result)
    }
}
