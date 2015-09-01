import AddInstructions from './instructions/AddInstructions'
import AndInstructions from './instructions/AndInstructions'
import CoreInstructions from './instructions/CoreInstructions'
import CompInstructions from './instructions/CompInstructions'
import CallInstructions from './instructions/CallInstructions'
import DecInstructions from './instructions/DecInstructions'
import IncInstructions from './instructions/IncInstructions'
import JumpInstructions from './instructions/JumpInstructions'
import LoadInstructions from './instructions/LoadInstructions'
import OrInstructions from './instructions/OrInstructions'
import RotateLeftCarryInstructions from './instructions/RotateLeftCarryInstructions'
import RotateRightCarryInstructions from './instructions/RotateRightCarryInstructions'
import ShiftLeftInstructions from './instructions/ShiftLeftInstructions'
import ShiftRightInstructions from './instructions/ShiftRightInstructions'
import SubInstructions from './instructions/SubInstructions'
import StackInstructions from './instructions/StackInstructions'
import XorInstructions from './instructions/XorInstructions'

import Statement from './Statement'

export const INSTRUCTIONS = [].concat(
    AddInstructions,
    AndInstructions,
    CoreInstructions,
    CallInstructions,
    CompInstructions,
    DecInstructions,
    IncInstructions,
    JumpInstructions,
    LoadInstructions,
    OrInstructions,
    RotateLeftCarryInstructions,
    RotateRightCarryInstructions,
    ShiftLeftInstructions,
    ShiftRightInstructions,
    SubInstructions,
    StackInstructions,
    XorInstructions
)

export const INSTRUCTIONS_BY_NAME = new Map()

const instructionsByOpcode = []

INSTRUCTIONS.forEach(instruction => {
    const name = instruction.name
    let variants = INSTRUCTIONS_BY_NAME.get(name)

    if (!variants) {
        variants = []
        INSTRUCTIONS_BY_NAME.set(name, variants)
    }
    variants.push(instruction)

    let opcodes = instructionsByOpcode
    if (instruction.opcodes.length > 1) {
        opcodes = instructionsByOpcode[instruction.opcodes[0]]
        if (!opcodes) {
            opcodes = []
            instructionsByOpcode[instruction.opcodes[0]] = opcodes
        }
    }
    if (typeof instruction.postfix !== 'number') {
        opcodes[instruction.opcodes[instruction.opcodes.length - 1]] = instruction
    } else {
        let subOpcodes = opcodes[instruction.opcodes[instruction.opcodes.length - 1]]
        if (!subOpcodes) {
            subOpcodes = []
            opcodes[instruction.opcodes[instruction.opcodes.length - 1]] = subOpcodes
        }
        subOpcodes[instruction.postfix] = instruction
    }
})

export function process(state) {
    const pcMem = state.getMemory(state.registers.PC, 4)

    if (pcMem.length > 0) {
        let instruction = instructionsByOpcode[pcMem[0]]

        if (instruction instanceof Array) {
            if (pcMem.length > 1) {
                instruction = instruction[pcMem[1]]
            } else {
                instruction = null
            }
        }
        if (instruction instanceof Array) {
            if (pcMem.length > 3) {
                instruction = instruction[pcMem[3]]
            } else {
                instruction = null
            }
        }
        if (instruction) {
            return instruction.process(state, pcMem)
        }
    }

    return null
}

export function createBlankStatement() {
    return Statement.create({
        type: 'blank',
        assembler: '  ',
        opcodes: () => [],
        size: 0
    })
}

export function createErrorStatement(line) {
    return Statement.create({
        type: 'error',
        assembler: line,
        opcodes: () => [],
        size: 0
    })
}

export function createLabelStatement(label) {
    return Statement.create({
        type: 'sourcelabel',
        assembler: `${label}:`,
        opcodes: () => [],
        updateLabel: (offset, labels) => labels.setAddress(label, offset),
        size: 0
    })
}

export function createInstructionStatement(elements) {
    if (!elements instanceof Array || elements.length === 0) {
        return null
    }
    const variants = INSTRUCTIONS_BY_NAME.get(elements[0].toUpperCase())

    if (!variants) {
        return null
    }

    const matchingVariant = variants.find((variant) => {
        const args = variant.args
        return args.length === elements.length - 1 &&
            args.every((pattern, index) => pattern.matches(elements[index + 1]))
    })

    if (matchingVariant) {
        const params = matchingVariant.args.map((pattern, i) => pattern.extractValue(elements[i + 1]))
        return matchingVariant.createStatement(params)
    }
    return null
}

export function parseLine(line) {
    const trimmed = line.trim()
    if (trimmed.length === 0) {
        return createBlankStatement()
    }
    if (trimmed.startsWith('.') && trimmed.endsWith(':')) {
        return createLabelStatement(trimmed.substr(0, trimmed.length - 1))
    }
    const instruction = createInstructionStatement(line.trim().replace(/<\-|,/, ' ').split(/\s+/))

    if (instruction) {
        return instruction
    }

    return createErrorStatement(line)
}
