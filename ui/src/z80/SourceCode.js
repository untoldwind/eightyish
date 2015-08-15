import * as InstructionSet from './InstructionSet';

import appDispatcher from '../dispatcher/AppDispatcher';
import * as AppConstants from '../dispatcher/AppConstants';
import * as formats from '../components/formats';

class Labels {
    getAddress(labelOfAddress) {
        var address = parseInt(labelOfAddress, 16);

        return [(address >> 8) & 0xff, address & 0xff];
    }
}

export default class SourceCode {
    constructor() {
        this.instructions = [
            InstructionSet.createInstruction(['CALL', '1234']),
            InstructionSet.createInstruction(['JUMP', '1234']),
            InstructionSet.createInstruction(['RET']),
            InstructionSet.createLabel('.bla'),
            InstructionSet.createInstruction(['HALT'])
        ];
        this.labels = new Labels();
    }

    get memory() {
        var offset = 0;
        var memory = [];

        for(var instruction of this.instructions) {
            var opcodes = instruction.opcodes(this.labels);

            memory.push(... opcodes);
            offset += opcodes.length;
        }

        return memory;
    }

    get memoryDump() {
        var lines = [];
        var offset = 0;

        for(var instruction of this.instructions) {
            var opcodes = instruction.opcodes(this.labels);

            lines.push([`${formats.word2hex(offset)}:`].concat(opcodes.map(opcode => formats.byte2hex(opcode))).join(' '));
            offset += opcodes.length;
        }

        return lines.join('\n');
    }

    get assembler() {
        return this.instructions.map(instruction => instruction.assembler).join('\n');
    }
}