import * as InstructionSet from './InstructionSet';

import appDispatcher from '../dispatcher/AppDispatcher';
import * as AppConstants from '../dispatcher/AppConstants';
import * as formats from '../components/formats';

class Labels {
    getAddress(labelOfAddress) {
        switch (typeof labelOfAddress) {
        case 'number':
            return [(labelOfAddress >> 8) & 0xff, labelOfAddress & 0xff];
        case 'string':
            if (labelOfAddress.startsWith('.')) {
                const address = this[labelOfAddress];

                if (address != undefined) {
                    return [(address >> 8) & 0xff, address & 0xff];
                }
            } else {
                const address = parseInt(labelOfAddress, 16);

                if (address != undefined) {
                    return [(address >> 8) & 0xff, address & 0xff];
                }
            }
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
        lines.forEach(line => this.instructions.push(InstructionSet.parseLine(line)));
        let offset = 0;
        for (let instruction of this.instructions) {
            if (instruction.updateLabel != undefined) {
                instruction.updateLabel(offset, this.labels);
            }
            offset += instruction.size;
        }
    }

    get memory() {
        let offset = 0;
        const memory = [];

        for (let instruction of this.instructions) {
            const opcodes = instruction.opcodes(this.labels);

            memory.push(... opcodes);
            offset += opcodes.length;
        }

        return memory;
    }

    get memoryDump() {
        let offset = 0;
        const lines = [];

        for (let instruction of this.instructions) {
            const opcodes = instruction.opcodes(this.labels);

            lines.push({offset: offset, dump: opcodes.map(opcode => formats.byte2hex(opcode)).join(' ')});
            offset += opcodes.length;
        }

        return lines;
    }

    get assembler() {
        return this.instructions.map(instruction => instruction.assembler);
    }
}