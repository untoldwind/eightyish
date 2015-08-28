import * as InstructionSet from './InstructionSet'

import * as formats from '../components/formats'

import SourceLabels from './SourceLabels'

export default class SourceCode {
    constructor() {
        this.statements = [
            InstructionSet.createStatement(['HALT'])
        ]
        this.labels = new SourceLabels()
    }

    compile(lines) {
        this.statements = []
        this.labels = new SourceLabels()

        if (!lines) {
            return
        }
        lines.forEach(line => this.statements.push(InstructionSet.parseLine(line)))
        let offset = 0
        for (let instruction of this.statements) {
            if (instruction.updateLabel) {
                instruction.updateLabel(offset, this.labels)
            }
            offset += instruction.size
        }
    }

    get memory() {
        let offset = 0
        const memory = []

        for (let instruction of this.statements) {
            const opcodes = instruction.opcodes(this.labels)

            memory.push(... opcodes)
            offset += opcodes.length
        }

        return memory
    }

    get memoryDump() {
        let offset = 0
        const lines = []

        for (let instruction of this.statements) {
            const opcodes = instruction.opcodes(this.labels)

            lines.push({offset: offset, dump: opcodes.map(formats.byte2hex).join(' ')})
            offset += opcodes.length
        }

        return lines
    }

    get assembler() {
        return this.statements.map(instruction => instruction.assembler)
    }
}
