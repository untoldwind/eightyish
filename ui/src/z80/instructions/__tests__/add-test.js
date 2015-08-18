jest.autoMockOff();

let add_instructions = require('../add');

describe('Add Instruction', () => {
    it('should not have duplicate opcodes', () => {
        let opcodes = new Set();

        for(let instruction of add_instructions) {
            opcodes.add(instruction.opcode)
        }

        expect(opcodes.size).toBe(add_instructions.length)
    });

    it('should support byte reigster adding', () => {

    })
});
