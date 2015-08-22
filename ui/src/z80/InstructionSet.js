import AddInstructions from './instructions/add'
import AndInstructions from './instructions/and'
import CoreInstructions from './instructions/core'
import CompInstructions from './instructions/comp'
import CallInstructions from './instructions/call'
import DecInstructions from './instructions/dec'
import IncInstructions from './instructions/inc'
import JumpInstructions from './instructions/jump'
import LoadInstructions from './instructions/load'
import OrInstructions from './instructions/or'
import SubInstructions from './instructions/sub'
import StackInstructions from './instructions/stack'
import XorInstructions from './instructions/xor'

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
    SubInstructions,
    StackInstructions,
    XorInstructions
)

const parseTree = {}

const opcodes = []

INSTRUCTIONS.forEach(instruction => {
    const name = instruction.name
    let variants = parseTree[name]

    if (!variants) {
        variants = []
        parseTree[name] = variants
    }
    variants.push(instruction)

    if (instruction.opcode >= 256) {
        let extended = opcodes[(instruction.opcode >> 8) & 0xff]

        if (!extended) {
            extended = []
            opcodes[(instruction.opcode >> 8) & 0xff] = extended
        }
        extended[instruction.opcode & 0xff] = instruction
    } else {
        opcodes[instruction.opcode] = instruction
    }
})

export function process(state) {
    const pcMem = state.getMemory(state.registers.PC, 4)

    if (pcMem.length > 0) {
        let instruction = opcodes[pcMem[0]]

        if (instruction instanceof Array) {
            if (pcMem.length > 1) {
                instruction = instruction[pcMem[1]]
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

export function createBlank() {
    return {
        type: 'blank',
        assembler: '  ',
        opcodes: () => [],
        size: 0
    }
}

export function createError(line) {
    return {
        type: 'error',
        assembler: line,
        opcodes: () => [],
        size: 0
    }
}

export function createLabel(label) {
    return {
        type: 'sourcelabel',
        assembler: `${label}:`,
        opcodes: () => [],
        updateLabel: (offset, labels) => labels.setAddress(label, offset),
        size: 0
    }
}

export function createInstruction(elements) {
    if (!elements instanceof Array || elements.length === 0) {
        return null
    }
    const variants = parseTree[elements[0].toUpperCase()]

    if (!variants) {
        return null
    }

    const matchingVariant = variants.find((variant) => {
        const argumentPattern = variant.argumentPattern
        return argumentPattern.length === elements.length - 1 &&
            argumentPattern.every((pattern, index) => pattern.matches(elements[index + 1]))
    })

    if (matchingVariant) {
        const params = matchingVariant.argumentPattern.map((pattern, i) => pattern.extractValue(elements[i + 1]))
        return matchingVariant.createAssembler(params)
    }
    return null
}

export function parseLine(line) {
    const trimmed = line.trim()
    if (trimmed.length === 0) {
        return createBlank()
    }
    if (trimmed.startsWith('.') && trimmed.endsWith(':')) {
        return createLabel(trimmed.substr(0, trimmed.length - 1))
    }
    const instruction = createInstruction(line.trim().replace(/<\-|,/, ' ').split(/\s+/))

    if (instruction) {
        return instruction
    }

    return createError(line)
}
