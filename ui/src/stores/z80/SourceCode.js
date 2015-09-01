import * as InstructionSet from './InstructionSet'

import SourceLabels from './SourceLabels'

export default class SourceCode {
    constructor(sourceOffset) {
        this.sourceOffset = sourceOffset
        this.statements = [
            InstructionSet.createInstructionStatement(['HALT'])
        ]
        this.labels = new SourceLabels()
    }

    compile(lines) {
        if (!lines) {
            return this
        }

        const statements = lines.map(line => InstructionSet.parseLine(line))
        const labels = new SourceLabels()

        let offset = this.sourceOffset
        for (let statement of statements) {
            if (statement.updateLabel) {
                statement.updateLabel(offset, labels)
            }
            offset += statement.size
        }

        return this.copy({
            statements: statements,
            labels: labels
        })
    }

    toggleBreakpoint(address) {
        let offset = this.sourceOffset

        for (let statement of this.statements) {
            if (offset === address) {
                statement.breakpoint = !statement.breakpoint
                return
            }
            offset += statement.size
        }
    }

    get memoryAndBreakpoints() {
        let offset = this.sourceOffset
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
        let offset = this.sourceOffset
        const lines = []

        for (let statement of this.statements) {
            const opcodes = statement.opcodes(this.labels)

            lines.push({
                breakpoint: statement.breakpoint,
                offset: offset,
                dump: opcodes
            })
            offset += opcodes.length
        }

        return lines
    }

    get assembler() {
        return this.statements.map(instruction => instruction.assembler)
    }

    copy(...changes) {
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, ...changes)
    }
}
