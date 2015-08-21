import TransferInstruction from './TransferInstruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

export default class ByteValueToRegisterInstruction extends TransferInstruction {
    constructor(opcode, name, to, operation) {
        super(opcode, name, [args.RegisterPattern(to), args.ByteValuePattern])
        this.to = to
        this.operation = operation
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        const result = this.operation(state.registers[this.to], pcMem[offset])
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result)
    }
}
