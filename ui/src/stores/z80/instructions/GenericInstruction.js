import Instruction from './Instruction'

import { PC } from './constants'

export default class GenericInstruction extends Instruction {
    constructor(opcode, cycles, name, args, operation, delim = ', ') {
        super(opcode, cycles, name, args, delim)
        this.operation = operation
    }

    process(state, pcMem) {
        const argPcMem = pcMem.subarray(this.opcodes.length)
        const transition = this.operation(
            this.args[0].storer(state, argPcMem),
            ... this.args.map((arg) => arg.loader(state, argPcMem)),
            state.registers.flagC)

        return transition.withWordRegister(PC, state.registers.PC + this.size).withCycles(this.cycles)
    }
}
