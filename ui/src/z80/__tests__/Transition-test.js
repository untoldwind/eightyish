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
        transition.undo(state);
        expect(state.registers.assign).toBeCalledWith({A: 23});
    });

    it('should support flags transitions', () => {
        const transition = new Transition().withFlags(0x83);

        expect(transition.newRegisters.flagP).toBe(true);
        expect(transition.newRegisters.flagS).toBe(true);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(transition.newRegisters.flagC).toBe(false);

        const state = {
            registers: {
                copy: jest.genMockFunction().mockReturnValue({AF: 0x2345}),
                assign: jest.genMockFunction()
            }
        };

        transition.perform(state);
        expect(state.registers.copy).toBeCalled();
        expect(state.registers.assign).toBeCalledWith({
            flagP: true,
            flagS: true,
            flagZ: false,
            flagC: false
        });
    });

    it('should support byte with flag transitions', () => {
        const transition = new Transition().withByteRegisterAndFlags('A', 13);

        expect(transition.newRegisters.A).toBe(13);
        expect(transition.newRegisters.flagP).toBe(true);
        expect(transition.newRegisters.flagS).toBe(false);
        expect(transition.newRegisters.flagZ).toBe(false);
        expect(transition.newRegisters.flagC).toBe(false);
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
        const transition = new Transition().withByteAt(5, 13);

        expect(transition.newRegisters).toEqual({});
        expect(transition.memoryOffset).toBe(5);
        expect(transition.newMemoryData).toEqual([13]);

        const state = {
            registers: {
                copy: jest.genMockFunction().mockReturnValue({}),
                assign: jest.genMockFunction()
            },
            memory: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        };

        transition.perform(state);
        expect(state.registers.copy).toBeCalled();
        expect(state.registers.assign).toBeCalledWith({});
        expect(state.memory).toEqual([0, 1, 2, 3, 4, 13, 6, 7, 8, 9]);
        expect(transition.oldMemoryData).toEqual([5]);

        transition.undo(state);

        expect(state.memory).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should support byte video changes', () => {
        const transition = new Transition().withByteAt(0x1005, 13);

        expect(transition.newRegisters).toEqual({});
        expect(transition.memoryOffset).toBe(0x1005);
        expect(transition.newMemoryData).toEqual([13]);

        const state = {
            registers: {
                copy: jest.genMockFunction().mockReturnValue({}),
                assign: jest.genMockFunction()
            },
            memory: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            videoOffset: 0x1000,
            videoMemory: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        };

        transition.perform(state);
        expect(state.registers.copy).toBeCalled();
        expect(state.registers.assign).toBeCalledWith({});
        expect(state.memory).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(state.videoMemory).toEqual([0, 1, 2, 3, 4, 13, 6, 7, 8, 9]);
        expect(transition.oldMemoryData).toEqual([5]);

        transition.undo(state);

        expect(state.videoMemory).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should support word memory changes', () => {
        const transition = new Transition().withWordAt(5, 0x1234);

        expect(transition.newRegisters).toEqual({});
        expect(transition.memoryOffset).toBe(5);
        expect(transition.newMemoryData).toEqual([0x12, 0x34]);

        const state = {
            registers: {
                copy: jest.genMockFunction().mockReturnValue({}),
                assign: jest.genMockFunction()
            },
            memory: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        };

        transition.perform(state);
        expect(state.registers.copy).toBeCalled();
        expect(state.registers.assign).toBeCalledWith({});
        expect(state.memory).toEqual([0, 1, 2, 3, 4, 0x12, 0x34, 7, 8, 9]);
        expect(transition.oldMemoryData).toEqual([5, 6]);

        transition.undo(state);

        expect(state.memory).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});
