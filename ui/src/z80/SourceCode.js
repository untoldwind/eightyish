import * as InstructionSet from './InstructionSet';

import appDispatcher from '../dispatcher/AppDispatcher';
import * as AppConstants from '../dispatcher/AppConstants';
import * as formats from '../components/formats';

class Labels {
    getAddress(labelOfAddress) {
        switch (typeof labelOfAddress) {
        case 'string':
            if (labelOfAddress.startsWith('.')) {
                let address = this[labelOfAddress];

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
        this.instructions = [
            InstructionSet.createInstruction(['HALT'])
        ];
        this.labels = new Labels();
    }

    compile(lines) {
        this.instructions = [];
        this.label = new Labels();

        if (lines == undefined) {
            return;
        }
        for (var line of lines) {
            this.instructions.push(InstructionSet.parseLine(line));
        }
        let offset = 0;
        for (var instruction of this.instructions) {
            if (instruction.updateLabel != undefined) {
                instruction.updateLabel(offset, this.labels);
            }
            offset += instruction.size;
        }
    }

    get memory() {
        let offset = 0;
        let memory = [];

        for (var instruction of this.instructions) {
            var opcodes = instruction.opcodes(this.labels);

            memory.push(... opcodes);
            offset += opcodes.length;
        }

        return memory;
    }

    get memoryDump() {
        let offset = 0;
        let lines = [];

        for (let instruction of this.instructions) {
            let opcodes = instruction.opcodes(this.labels);

            lines.push({offset: offset, dump: opcodes.map(opcode => formats.byte2hex(opcode)).join(' ')});
            offset += opcodes.length;
        }

        return lines;
    }

    get assembler() {
        return this.instructions.map(instruction => instruction.assembler);
    }
}