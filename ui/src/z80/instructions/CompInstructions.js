import Instruction from './Instruction'
import Transition from '../Transition'

import * as args from './Arguments'

import { createFromRegisterInstructions } from './factory'

import { COMP, HL, IX, IY } from './constants'

class CompWithRegister extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, COMP, [args.RegisterArgument(to), args.RegisterArgument(from)])
        this.to = to
        this.from = from
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(state.registers[this.to] - state.registers[this.from])
    }
}

class CompWithPointer extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, COMP, [args.RegisterArgument(to), args.RegisterBytePointerArgument(from)])
        this.to = to
        this.from = from
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(this.to, state.registers[this.to] - state.getMemoryByte(state.registers[this.from]))
    }
}

class CompWithIndexPointer extends Instruction {
    constructor(opcode, to, from) {
        super(opcode, COMP, [args.RegisterArgument(to), args.IndexRegisterBytePointerPattern(from)])
        this.to = to
        this.from = from
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(this.to, state.registers[this.to] -
            state.getMemoryByte(state.registers[this.from] + pcMem[offset]))
    }
}

class CompWithValue extends Instruction {
    constructor(opcode, to) {
        super(opcode, COMP, [args.RegisterArgument(to), args.ByteValueArgument])
        this.to = to
    }

    process(state, pcMem) {
        const offset = this.opcodes.length
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(state.registers[this.to] - pcMem[offset])
    }
}

export default [
    new CompWithValue(0xfe, 'A'),
    new CompWithPointer(0xbe, 'A', HL),
    new CompWithIndexPointer(0xddbe, 'A', IX),
    new CompWithIndexPointer(0xfdbe, 'A', IY)
].concat(createFromRegisterInstructions(0xb8, (opcode, register) =>
        new CompWithRegister(opcode, 'A', register)))
