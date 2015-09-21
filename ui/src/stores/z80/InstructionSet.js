import * as AddInstructions from './instructions/AddInstructions'
import * as AndInstructions from './instructions/AndInstructions'
import * as CompInstructions from './instructions/CompInstructions'
import * as CallInstructions from './instructions/CallInstructions'
import * as DecInstructions from './instructions/DecInstructions'
import * as HaltInstruction from './instructions/HaltInstruction'
import * as IncInstructions from './instructions/IncInstructions'
import * as JumpInstructions from './instructions/JumpInstructions'
import * as LoadInstructions from './instructions/LoadInstructions'
import * as NopInstruction from './instructions/NopInstruction'
import * as OutInstructions from './instructions/OutInstructions'
import * as OrInstructions from './instructions/OrInstructions'
import * as PopInstructions from './instructions/PopInstructions'
import * as PushInstructions from './instructions/PushInstructions'
import * as ReturnInstructions from './instructions/ReturnInstructions'
import * as RotateLeftCarryInstructions from './instructions/RotateLeftCarryInstructions'
import * as RotateRightCarryInstructions from './instructions/RotateRightCarryInstructions'
import * as ShiftLeftInstructions from './instructions/ShiftLeftInstructions'
import * as ShiftRightInstructions from './instructions/ShiftRightInstructions'
import * as SubInstructions from './instructions/SubInstructions'
import * as XorInstructions from './instructions/XorInstructions'

import Statement from './Statement'

export const INSTRUCTION_GROUPS = [
    AddInstructions,
    AndInstructions,
    CallInstructions,
    CompInstructions,
    DecInstructions,
    HaltInstruction,
    IncInstructions,
    JumpInstructions,
    LoadInstructions,
    NopInstruction,
    OutInstructions,
    OrInstructions,
    PopInstructions,
    PushInstructions,
    ReturnInstructions,
    RotateLeftCarryInstructions,
    RotateRightCarryInstructions,
    ShiftLeftInstructions,
    ShiftRightInstructions,
    SubInstructions,
    XorInstructions
]

export const INSTRUCTIONS = [].concat(...INSTRUCTION_GROUPS.map((instructionGroup) => instructionGroup.instructions))

const instructionsByName = new Map()
const instructionsByOpcode = []

INSTRUCTIONS.forEach(instruction => {
    const name = instruction.name
    let variants = instructionsByName.get(name)

    if (!variants) {
        variants = []
        instructionsByName.set(name, variants)
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

export function createCommentStatement(comment) {
    return Statement.create({
        type: 'comment',
        assembler: `#${comment}`,
        opcodes: () => [],
        size: 0
    })
}

export function createDataStatement(dataSource) {
    const trimmed = dataSource.trim()
    let data

    if (trimmed.startsWith('0x')) {
        data = trimmed.slice(2).split(' ').map((str) => parseInt(str, 16) & 0xff)
    } else if (trimmed.startsWith('0b')) {
        data = trimmed.slice(2).split(' ').map((str) => parseInt(str, 2) & 0xff)
    } else if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        data = [...JSON.parse(trimmed)].map((c) => c.charCodeAt(0)).concat(0)
    } else {
        data = trimmed.split(' ').map((str) => parseInt(str, 10) & 0xff)
    }
    return Statement.create({
        type: 'data',
        assembler: `= ${trimmed}`,
        opcodes: () => data,
        size: data.length
    })
}

export function createInstructionStatement(elements) {
    if (!elements instanceof Array || elements.length === 0) {
        return null
    }
    const variants = instructionsByName.get(elements[0].toUpperCase())

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
    if (trimmed.startsWith('#')) {
        return createCommentStatement(trimmed.slice(1))
    }
    if (trimmed.startsWith('=')) {
        return createDataStatement(trimmed.slice(1))
    }
    const instruction = createInstructionStatement(line.trim().replace(/<\-|,/, ' ').split(/\s+/))

    if (instruction) {
        return instruction
    }

    return createErrorStatement(line)
}
