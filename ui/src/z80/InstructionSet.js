
import add_instructions from './instructions/add';
import core_instructions from './instructions/core';
import call_instructions from './instructions/call';
import jump_instructions from './instructions/jump';
import load_instructions from './instructions/load';
import sub_instructions from './instructions/sub';
import stack_instructions from './instructions/stack';

import {ArgumentPattern} from './instructions/ArgumentPatterns';

var instructions = [].concat(
    add_instructions,
    core_instructions,
    call_instructions,
    jump_instructions,
    load_instructions,
    sub_instructions,
    stack_instructions);

var parseTree = {};

instructions.forEach(instruction => {
    var name = instruction.name;
    var variants = parseTree[name];

    if(variants == undefined) {
        variants = [];
        parseTree[name] = variants;
    }
    variants.push(instruction);
});

export function createLabel(label) {
    return {
        assembler: `${label}:`,
        opcodes: (labels) => []
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
                return variant.create(... elements.slice(1));
            }
        }
    }
    return undefined;
}
