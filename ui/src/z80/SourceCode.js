import * as InstructionSet from './InstructionSet';


export default class SourceCode {
    constructor() {
        this.instructions = [
            InstructionSet.createInstruction(['CALL', '1234']),
            InstructionSet.createInstruction(['JUMP', '1234']),
            InstructionSet.createInstruction(['RET']),
            InstructionSet.createInstruction(['HALT'])
        ];
        this.labels = {};
    }

    get assembler() {
        return this.instructions.map(instruction => instruction.assembler).join('\n');
    }
}