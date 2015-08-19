import Instruction from './Instruction';
import Transition from '../Transition';

import * as args from './ArgumentPatterns';

export default class WordValueToRegisterInstruction extends Instruction {
    constructor(opcode, name, to, operation) {
        super(opcode, name, [to, args.AddressOrLabelPattern], 2);
        this.to = to;
        this.operation = operation;
    }

    createAssembler(to, labelOrAddress) {
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.to} <- ${labelOrAddress}`,
            opcodes: (labels) => this.opcodes.concat(labels.getAddress(labelOrAddress)),
            size: this.size
        }
    }

    process(state, pcMem) {
        let offset = this.opcodes.length;
        let result = this.operation(state.registers[this.to], (pcMem[offset] << 8) | pcMem[offset + 1]);
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withByteRegisterAndFlags(this.to, result)
    }
}
