import add_instructions from './instructions/add';
import core_instructions from './instructions/core';
import call_instructions from './instructions/call';
import dec_instructions from './instructions/dec';
import inc_instructions from './instructions/inc';
import jump_instructions from './instructions/jump';
import load_instructions from './instructions/load';
import sub_instructions from './instructions/sub';
import stack_instructions from './instructions/stack';

import {ArgumentPattern} from './instructions/ArgumentPatterns';

var instructions = [].concat(
    add_instructions,
    core_instructions,
    call_instructions,
    dec_instructions,
    inc_instructions,
    jump_instructions,
    load_instructions,
    sub_instructions,
    stack_instructions);

var parseTree = {};

var opcodes = [];

instructions.forEach(instruction => {
    var name = instruction.name;
    var variants = parseTree[name];

    if (variants == undefined) {
        variants = [];
        parseTree[name] = variants;
    }
    variants.push(instruction);

    if (instruction.opcode >= 256) {
        var extended = opcodes[(instruction.opcode >> 8) & 0xff];

        if (extended == undefined) {
            extended = [];
            opcodes[(instruction.opcode >> 8) & 0xff] = extended;
        }
        extended[instruction.opcode & 0xff] = instruction;
    } else {
        opcodes[instruction.opcode] = instruction
    }
});

export function process(state) {
    var memory = state.getMemory(state.registers.PC, 4);

    if (memory.length > 0) {
        var instruction = opcodes[memory[0]];

        if (instruction instanceof Array) {
            if (memory.length > 1) {
                instruction = instruction[memory[1]];
            } else {
                instruction = undefined
            }
        }
        if (instruction != undefined) {
            console.log(instruction);
            return instruction.process(state.registers, memory)
        }
    }

    return undefined
}

export function parseLine(line) {
    var trimmed = line.trim();
    if (trimmed.length == 0) {
        return createBlank()
    }
    if (trimmed.startsWith('.') && trimmed.endsWith(':')) {
        return createLabel(trimmed.substr(0, trimmed.length - 1))
    }
    var instruction = createInstruction(line.trim().split(/[\s,<>\-]+/));

    if (instruction != undefined) {
        return instruction;
    }

    return createError(line)
}

export function createBlank() {
    return {
        type: 'blank',
        assembler: '  ',
        opcodes: (labels) => [],
        size: 0

    }
}

export function createError(line) {
    return {
        type: 'error',
        assembler: `<span style="color: red">${line}</span>`,
        opcodes: (labels) => [],
        size: 0
    }
}

export function createLabel(label) {
    return {
        type: 'jumplabel',
        assembler: `${label}:`,
        opcodes: (labels) => [],
        updateLabel: (offset, labels) => labels[label] = offset,
        size: 0
    }
}

export function createInstruction(elements) {
    if (!elements instanceof Array || elements.length == 0) {
        return undefined;
    }
    var variants = parseTree[elements[0].toUpperCase()];

    if (variants == undefined) {
        return undefined;
    }

    for (var variant of variants) {
        var argumentPattern = variant.argumentPattern;
        if (argumentPattern.length == elements.length - 1) {
            for (var i = 0; i < argumentPattern.length; i++) {
                if (argumentPattern[i] instanceof ArgumentPattern && !argumentPattern[i].matches(elements[i + 1])) {
                    break;
                } else if (typeof argumentPattern[i] == 'string' && argumentPattern[i] != elements[i + 1].toUpperCase()) {
                    break;
                }
            }
            if (i == argumentPattern.length) {
                return variant.createAssembler(... elements.slice(1));
            }
        }
    }
    return undefined;
}
