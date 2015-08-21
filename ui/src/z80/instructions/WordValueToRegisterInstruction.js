import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

export default class WordValueToRegisterInstruction extends Instruction {
    constructor(opcode, name, to, operation) {
        super(opcode, name, [args.RegisterPattern(to), args.AddressOrLabelPattern], ' <- ')
        this.to = to
        this.operation = operation
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        const result = this.operation(state.registers[this.to], (pcMem[offset] << 8) | pcMem[offset + 1])
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result)
    }
}
