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
        for (let statement of this.statements) {
            if (statement.updateLabel) {
                statement.updateLabel(offset, this.labels)
            }
            offset += statement.size
        }
    }

    toggleBreakpoint(address) {
        let offset = 0

        for (let statement of this.statements) {
            if (offset === address) {
                statement.breakpoint = !statement.breakpoint
                return
            }
            offset += statement.size
        }
    }

    get memoryAndBreakpoints() {
        let offset = 0
        const memory = []
        const breakpoints = []

        for (let statement of this.statements) {
            if (statement.breakpoint) {
                breakpoints.push(offset)
            }
            const opcodes = statement.opcodes(this.labels)

            memory.push(... opcodes)
            offset += opcodes.length
        }

        return [memory, breakpoints]
    }

    get memoryDump() {
        let offset = 0
        const lines = []

        for (let statement of this.statements) {
            const opcodes = statement.opcodes(this.labels)

            lines.push({
                breakpoint: statement.breakpoint,
                offset: offset,
                dump: opcodes.map(formats.byte2hex).join(' ')
            })
            offset += opcodes.length
        }

        return lines
    }

    get assembler() {
        return this.statements.map(instruction => instruction.assembler)
    }
}
