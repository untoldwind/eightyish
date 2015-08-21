import Instruction from './Instruction'

export default class GenericInstruction extends Instruction {
    constructor(opcode, name, argumentPattern, extra = 0) {
        super(opcode, name, argumentPattern, extra)
    }

    createAssembler(...params) {
        const values = this.argumentPattern.map((pattern, i) => pattern.extractValue(params[i]))
        const formattedParams = this.argumentPattern.map((pattern, i) => pattern.formatValue(values[i]))
        return {
            type: 'instruction',
            assembler: formattedParams.length === 0 ? this.name : `${this.name}\t${formattedParams.join(', ')}`,
            opcodes: (labels) => {
                const extraOpcodes = this.argumentPattern.map((pattern, i) => pattern.extraOpcodes(values[i], labels))
                return this.opcodes.concat(...extraOpcodes)
            },
            size: this.size
        }
    }
}
