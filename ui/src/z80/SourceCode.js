
import * as InstructionSet from './InstructionSet';

InstructionSet.createInstruction(["CALL", "1234"]);

export default class SourceCode {
    constructor() {
        this.instructions = [];
        this.labels = {};
    }
}