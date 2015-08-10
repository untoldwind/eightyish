
import core_instructions from './instructions/core';
import call_instructions from './instructions/call';
import load_instructions from './instructions/load';
import stack_instructions from './instructions/stack';

var instructions = [];

instructions.push(... core_instructions);
instructions.push(... call_instructions);
instructions.push(... load_instructions);
instructions.push(... stack_instructions);

export default instructions;
