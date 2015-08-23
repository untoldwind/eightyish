
export default class Instruction {
    constructor(opcode, name, args, delim = ', ') {
        this.opcode = opcode
        this.name = name
        this.args = args
        if (opcode < 256) {
            this.opcodes = [opcode]
        } else {
            this.opcodes = [(opcode >> 8) & 0xff, opcode & 0xff]
        }
        this.size = this.opcodes.length + this.args.reduce((prev, pattern) => prev + pattern.extraSize, 0)
        this.delim = delim
    }

    createAssembler(params) {
        const formattedParams = this.args.map((pattern, i) => pattern.formatValue(params[i]))
        return {
            type: 'instruction',
            assembler: formattedParams.length === 0 ? this.name : `${this.name}\t${formattedParams.join(this.delim)}`,
            opcodes: (labels) => {
                const extraOpcodes = this.args.map((pattern, i) => pattern.extraOpcodes(params[i], labels))
                return this.opcodes.concat(...extraOpcodes)
            },
            size: this.size
        }
    }

    get example() {
        const params = this.args.map((pattern) => pattern.example)

        return params.length === 0 ? this.name : `${this.name}\t${params.join(this.delim)}`
    }
}
