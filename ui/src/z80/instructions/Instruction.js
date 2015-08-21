
export default class Instruction {
    constructor(opcode, name, argumentPattern, delim = ', ') {
        this.opcode = opcode
        this.name = name
        this.argumentPattern = argumentPattern
        if (opcode < 256) {
            this.opcodes = [opcode]
        } else {
            this.opcodes = [(opcode >> 8) & 0xff, opcode & 0xff]
        }
        this.size = this.opcodes.length + this.argumentPattern.reduce((prev, pattern) => prev + pattern.extraSize, 0)
        this.delim = delim
    }

    createAssembler(...params) {
        const values = this.argumentPattern.map((pattern, i) => pattern.extractValue(params[i]))
        const formattedParams = this.argumentPattern.map((pattern, i) => pattern.formatValue(values[i]))
        return {
            type: 'instruction',
            assembler: formattedParams.length === 0 ? this.name : `${this.name}\t${formattedParams.join(this.delim)}`,
            opcodes: (labels) => {
                const extraOpcodes = this.argumentPattern.map((pattern, i) => pattern.extraOpcodes(values[i], labels))
                return this.opcodes.concat(...extraOpcodes)
            },
            size: this.size
        }
    }
}
