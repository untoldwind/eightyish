jest.autoMockOff()

const Transition = require('../Transition')
const MachineState = require('../MachineState')
const MemoryBlock = require('../MemoryBlock')

describe('Transition', () => {
    it('should support byte register transitions', () => {
        const transition = new Transition().withByteRegister('A', 13)

        expect(transition.newRegisters.A).toBe(13)

        const state = MachineState.create(10, 10, 8)
        const nextState = transition.perform(state)

        expect(nextState.registers.A).toBe(13)
        expect(nextState.transitions.elements).toEqual([transition])
        expect(transition.oldRegisters).toBe(state.registers)

        const undoedState = transition.undo(nextState)
        expect(undoedState.registers.A).toBe(0)
        expect(undoedState.transitions.elements).toEqual([])
    })

    it('should support flags transitions', () => {
        const transition = new Transition().withFlags(0x83).withCarry(false)

        expect(transition.newFlags.P).toBe(true)
        expect(transition.newFlags.S).toBe(true)
        expect(transition.newFlags.Z).toBe(false)
        expect(transition.newFlags.C).toBe(false)

        const state = MachineState.create(10, 10, 8)
        const nextState = transition.perform(state)

        expect(nextState.registers.flags.P).toBe(true)
        expect(nextState.registers.flags.S).toBe(true)
        expect(nextState.registers.flags.Z).toBe(false)
        expect(nextState.registers.flags.C).toBe(false)
    })
    
    it('should support word register transitions', () => {
        const transition = new Transition().withWordRegister('BC', 0x1234)

        expect(transition.newRegisters.BC).toBe(0x1234)

        const state = MachineState.create(10, 10, 8)
        const nextState = transition.perform(state)

        expect(nextState.registers.B).toBe(0x12)
        expect(nextState.registers.C).toBe(0x34)
        expect(nextState.registers.BC).toBe(0x1234)
    })

    it('should support byte memory changes', () => {
        const transition = new Transition().withByteAt(5, 13)

        expect(transition.newRegisters).toEqual({})
        expect(transition.memoryOffset).toBe(5)
        expect(transition.newMemoryData).toEqual([13])

        const state = MachineState.create(10, 10, 8)
        const nextState = transition.perform(state)

        expect(nextState.memory.data).toEqual([0, 0, 0, 0, 0, 13, 0, 0, 0, 0])

        const undoedState = transition.undo(nextState)

        expect(undoedState.memory.data).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })

    it('should support byte video changes', () => {
        const transition = new Transition().withByteAt(0x1005, 13)

        expect(transition.newRegisters).toEqual({})
        expect(transition.memoryOffset).toBe(0x1005)
        expect(transition.newMemoryData).toEqual([13])

        const state = MachineState.create(10, 10, 8).copy({
            videoMemory: MemoryBlock.create(0x1000, 10)
        })
        const nextState = transition.perform(state)

        expect(nextState.videoMemory.data).toEqual([0, 0, 0, 0, 0, 13, 0, 0, 0, 0])

        const undoedState = transition.undo(nextState)

        expect(undoedState.videoMemory.data).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })

    it('should support word memory changes', () => {
        const transition = new Transition().withWordAt(5, 0x1234)

        expect(transition.newRegisters).toEqual({})
        expect(transition.memoryOffset).toBe(5)
        expect(transition.newMemoryData).toEqual([0x12, 0x34])

        const state = MachineState.create(10, 10, 8)
        const nextState = transition.perform(state)

        expect(nextState.memory.data).toEqual([0, 0, 0, 0, 0, 0x12, 0x34, 0, 0, 0])

        const undoedState = transition.undo(nextState)

        expect(undoedState.memory.data).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    })
})
