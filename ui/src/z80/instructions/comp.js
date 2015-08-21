import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import * as args from './ArgumentPatterns'

class CompWithRegister extends GenericInstruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.RegisterPattern(from)])
        this.to = to
        this.from = from
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(state.registers[this.to] - state.registers[this.from])
    }
}

class CompWithPointer extends GenericInstruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.RegisterPointerPattern(from)])
        this.to = to
        this.from = from
    }

    process(state) {
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withFlags(this.to, state.registers[this.to] - state.getMemoryByte(state.registers[this.from]))
    }
}

class CompWithIndexPointer extends GenericInstruction {
    constructor(opcode, to, from) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.IndexPointerPattern(from)])
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

class CompWithValue extends GenericInstruction {
    constructor(opcode, to) {
        super(opcode, 'COMP', [args.RegisterPattern(to), args.ByteValuePattern])
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
    new CompWithRegister(0xb8, 'A', 'B'),
    new CompWithRegister(0xb9, 'A', 'C'),
    new CompWithRegister(0xba, 'A', 'D'),
    new CompWithRegister(0xbb, 'A', 'E'),
    new CompWithValue(0xfe, 'A'),
    new CompWithPointer(0xbe, 'A', 'HL'),
    new CompWithIndexPointer(0xddbe, 'A', 'IX'),
    new CompWithIndexPointer(0xfdbe, 'A', 'IY')
]
