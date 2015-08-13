
export default class InstructionFactory {
    constructor(opcode, name, argumentPattern) {
        this.opcode = opcode;
        this.name = name;
        this.argumentPattern = argumentPattern;
    }
}
