function byteParity(value) {
    let parity = value ^ (value >> 1)
    parity ^= parity >> 2
    parity ^= parity >> 4
    return parity & 0x1
}

export default class Transition {
    constructor(newRegisters, memoryOffset, newMemoryData) {
        this.newRegisters = newRegisters || {}
        this.newFlags = {}
        this.memoryOffset = memoryOffset
        this.newMemoryData = newMemoryData
    }

    withByteRegister(register, value) {
        this.newRegisters[register] = value & 0xff

        return this
    }

    withFlag(flag, value) {
        this.newFlags[flag] = value

        return this
    }

    withFlags(value) {
        this.newFlags.P = byteParity(value) !== 0
        this.newFlags.C = (value & 0x100) !== 0
        this.newFlags.Z = value === 0
        this.newFlags.S = (value & 0x80) !== 0

        return this
    }

    withByteRegisterAndFlags(register, value) {
        this.newRegisters[register] = value & 0xff

        return this.withFlags(value)
    }

    withWordRegister(register, value) {
        this.newRegisters[register] = value & 0xffff

        return this
    }

    withByteAt(address, value) {
        this.memoryOffset = address
        this.newMemoryData = [value]

        return this
    }

    withWordAt(address, value) {
        this.memoryOffset = address
        this.newMemoryData = [(value >> 8) & 0xff, value & 0xff]

        return this
    }

    withCycles(cycles) {
        this.cycles = cycles

        return this
    }

    perform(state) {
        this.oldRegisters = state.registers.copy()
        state.registers.assign(this.newRegisters, this.newFlags)
        if (typeof this.memoryOffset === 'number') {
            if (this.memoryOffset < state.memory.length) {
                this.oldMemoryData = state.memory.slice(this.memoryOffset,
                    this.memoryOffset + this.newMemoryData.length)
                for (let i = 0; i < this.newMemoryData.length; i++) {
                    state.memory[this.memoryOffset + i] = this.newMemoryData[i]
                }
            } else if (this.memoryOffset - state.videoOffset < state.videoMemory.length) {
                this.oldMemoryData = state.videoMemory.slice(this.memoryOffset - state.videoOffset,
                    this.memoryOffset - state.videoOffset + this.newMemoryData.length)
                for (let i = 0; i < this.newMemoryData.length; i++) {
                    state.videoMemory[this.memoryOffset - state.videoOffset + i] = this.newMemoryData[i]
                }
            }
        }
        if (typeof this.cycles === 'number') {
            state.totalCycles += this.cycles
        }
    }

    undo(state) {
        state.registers.assign(this.oldRegisters, {})
        if (typeof this.memoryOffset === 'number') {
            if (this.memoryOffset < state.memory.length) {
                for (let i = 0; i < this.oldMemoryData.length; i++) {
                    state.memory[this.memoryOffset + i] = this.oldMemoryData[i]
                }
            } else if (this.memoryOffset - state.videoOffset < state.videoMemory.length) {
                for (let i = 0; i < this.oldMemoryData.length; i++) {
                    state.videoMemory[this.memoryOffset - state.videoOffset + i] = this.oldMemoryData[i]
                }
            }
        }
        if (typeof this.cycles === 'number') {
            state.totalCycles -= this.cycles
        }
    }
}
