import {fill} from '../formats'

import Statement from '../Statement'

export default class Instruction {
    constructor(opcode, cycles, name, args, delim = ', ') {
        this.opcode = opcode
        this.cycles = cycles
        this.name = name
        this.args = args
        if (opcode <= 0xff) {
            this.opcodes = [opcode]
        } else if (opcode <= 0xffff) {
            this.opcodes = [(opcode >> 8) & 0xff, opcode & 0xff]
        } else {
            this.opcodes = [(opcode >> 16) & 0xff, (opcode >> 8) & 0xff]
            this.postfix = opcode & 0xff
        }
        this.size = this.opcodes.length +
            this.args.reduce((prev, pattern) => prev + pattern.extraSize, 0) +
            (typeof this.postfix === 'number' ? 1 : 0)
        this.delim = delim
    }

    createStatement(params) {
        const formattedParams = this.args.map((pattern, i) => pattern.formatValue(params[i]))
        return Statement.create({
            type: 'instruction',
            assembler: formattedParams.length === 0 ?
                `  ${this.name}` : `  ${this.name}${fill(this.name, 7)}${formattedParams.join(this.delim)}`,
            opcodes: (labels) => {
                const extraOpcodes = this.args.map((pattern, i) => pattern.extraOpcodes(params[i], labels))
                return this.opcodes.concat(...extraOpcodes).concat(this.postfix || [])
            },
            size: this.size
        })
    }

    get example() {
        const params = this.args.map((pattern) => pattern.example)

        return params.length === 0 ? this.name : `${this.name}\t${params.join(this.delim)}`
    }
}
