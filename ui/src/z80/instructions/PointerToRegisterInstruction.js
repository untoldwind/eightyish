import TransferInstruction from './TransferInstruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

export default class PointerToRegisterInstruction extends TransferInstruction {
    constructor(opcode, name, to, from, operation) {
        super(opcode, name, [args.RegisterPattern(to), args.RegisterPointerPattern(from)])
        this.to = to
        this.from = from
        this.operation = operation
    }

    process(state) {
        const result = this.operation(state.registers[this.to], state.getMemoryByte(state.registers[this.from]))
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result)
    }
}
