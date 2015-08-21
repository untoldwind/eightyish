import Instruction from './Instruction'

export default class TransferInstruction extends Instruction {
    constructor(opcode, name, argumentPattern) {
        super(opcode, name, argumentPattern)
    }

    createAssembler(...params) {
        const values = this.argumentPattern.map((pattern, i) => pattern.extractValue(params[i]))
        const formattedParams = this.argumentPattern.map((pattern, i) => pattern.formatValue(values[i]))
        return {
            type: 'instruction',
            assembler: `${this.name}\t${formattedParams.join(' <- ')}`,
            opcodes: (labels) => {
                const extraOpcodes = this.argumentPattern.map((pattern, i) => pattern.extraOpcodes(values[i], labels))
                return this.opcodes.concat(...extraOpcodes)
            },
            size: this.size
        }
    }
}
