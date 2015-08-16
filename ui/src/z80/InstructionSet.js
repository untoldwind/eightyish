
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

    if(variants == undefined) {
        variants = [];
        parseTree[name] = variants;
    }
    variants.push(instruction);

    opcodes[instruction.opcode] = instruction;
});

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

    return createError(line);
}

export function createBlank() {
    return {
        assembler: '',
        opcodes: (labels) => [],
        size: 0

    }
}

export function createError(line) {
    return {
        assembler: `<span style="color: red">${line}</span>`,
        opcodes: (labels) => [],
        size: 0
    }
}

export function createLabel(label) {
    return {
        assembler: `${label}:`,
        opcodes: (labels) => [],
        updateLabel: (offset, labels) => labels[label] = offset,
        size: 0
    }
}

export function createInstruction(elements) {
    if(!elements instanceof Array || elements.length == 0) {
        return undefined;
    }
    var variants = parseTree[elements[0].toUpperCase()];

    if (variants == undefined) {
        return undefined;
    }

    for(var variant of variants) {
        var argumentPattern = variant.argumentPattern;
        if(argumentPattern.length == elements.length - 1) {
            for(var i = 0; i < argumentPattern.length; i++) {
                if(argumentPattern[i] instanceof ArgumentPattern && !argumentPattern[i].matches(elements[i + 1])) {
                    break;
                } else if(typeof argumentPattern[i] == 'string' && argumentPattern[i] != elements[i + 1].toUpperCase()) {
                    break;
                }
            }
            if( i == argumentPattern.length) {
                return variant.createAssembler(... elements.slice(1));
            }
        }
    }
    return undefined;
}
