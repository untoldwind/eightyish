import * as InstructionSet from './InstructionSet';

import appDispatcher from '../dispatcher/AppDispatcher';
import * as AppConstants from '../dispatcher/AppConstants';
import * as formats from '../components/formats';

class Labels {
    getAddress(labelOfAddress) {
        switch (typeof labelOfAddress) {
        case 'string':
            if (labelOfAddress.startsWith('.')) {
                var address = this[labelOfAddress];

                if (address != undefined) {
                    return [(address >> 8) & 0xff, address & 0xff];
                }
            } else {
                var address = parseInt(labelOfAddress, 16);

                if (address != undefined) {
                    return [(address >> 8) & 0xff, address & 0xff];
                }
            }
        case 'number':
            return [(labelOfAddress >> 8) & 0xff, labelOfAddress & 0xff];
        }

        return 0;
    }
}

export default class SourceCode {
    constructor() {
        this.instructions = [];
        this.labels = new Labels();
        this.compile('  CALL	.bla\n  JUMP	1234\n  RET\n.bla:\n  HALT\n');
    }

    compile(source) {
        this.instructions = [];
        this.label = new Labels();

        if (source == undefined) {
            return;
        }
        for (var line of source.trim().split(/(<br>|\r|\n)/)) {
            this.instructions.push(InstructionSet.parseLine(line));
        }
        var offset = 0;
        for (var instruction of this.instructions) {
            if (instruction.updateLabel != undefined) {
                instruction.updateLabel(offset, this.labels);
            }
            offset += instruction.size;
        }
    }

    get memory() {
        var offset = 0;
        var memory = [];

        for (var instruction of this.instructions) {
            var opcodes = instruction.opcodes(this.labels);

            memory.push(... opcodes);
            offset += opcodes.length;
        }

        return memory;
    }

    get memoryDump() {
        var offset = 0;
        var lines = [];

        for (var instruction of this.instructions) {
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