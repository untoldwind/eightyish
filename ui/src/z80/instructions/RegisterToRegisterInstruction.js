import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

export default class RegisterToRegisterInstruction extends Instruction {
    constructor(opcode, name, to, from, operation) {
        super(opcode, name, [args.RegisterPattern(to), args.RegisterPattern(from)])
        this.to = to
        this.from = from
        this.byte = to.length === 1
        this.operation = operation
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to} <- ${this.from}`,
            opcodes: () => this.opcodes,
            size: this.size
        }
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
