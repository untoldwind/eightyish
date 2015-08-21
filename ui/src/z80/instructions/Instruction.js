
export default class Instruction {
    constructor(opcode, name, argumentPattern) {
        this.opcode = opcode
        this.name = name
        this.argumentPattern = argumentPattern
        if (opcode < 256) {
            this.opcodes = [opcode]
        } else {
            this.opcodes = [(opcode >> 8) & 0xff, opcode & 0xff]
        }
        this.size = this.opcodes.length + this.argumentPattern.reduce((prev, pattern) => prev + pattern.extraSize, 0)
    }
}
