jest.dontMock('../Transition');

const Transition = require('../Transition');

describe('Transition', () => {
    it('should support byte register transitions', () => {
        const transition = new Transition().withByteRegister('A', 13);

        expect(transition.newRegisters.A).toBe(13);

        const state = {
            registers: {
                copy: jest.genMockFunction().mockReturnValue({A: 23}),
                assign: jest.genMockFunction()
            }
        };

        transition.perform(state);
        expect(state.registers.copy).toBeCalled();
        expect(state.registers.assign).toBeCalledWith({A: 13});
        expect(transition.oldRegisters).toEqual({A: 23});

        state.registers.assign.mockClear();
        transition.undo(state)
        expect(state.registers.assign).toBeCalledWith({A: 23});
    });

    it('should support word register transitions', () => {
        const transition = new Transition().withWordRegister('AF', 0x1234);

        expect(transition.newRegisters.AF).toBe(0x1234);

        const state = {
            registers: {
                copy: jest.genMockFunction().mockReturnValue({AF: 0x2345}),
                assign: jest.genMockFunction()
            }
        };

        transition.perform(state);
        expect(state.registers.copy).toBeCalled();
        expect(state.registers.assign).toBeCalledWith({AF: 0x1234});
        expect(transition.oldRegisters).toEqual({AF: 0x2345});
    });

    it('should support byte memory changes', () => {
        const transition = new Transition().withByteAt(0x1234, 13);

        expect(transition.newRegisters).toEqual({});
        expect(transition.memoryOffset).toBe(0x1234);
        expect(transition.newMemoryData).toEqual([13]);
    });
});
