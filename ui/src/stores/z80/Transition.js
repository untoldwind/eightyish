function byteParity(value) {
    let parity = value ^ (value >> 1)
    parity ^= parity >> 2
    parity ^= parity >> 4
    return parity & 0x1
}

export default class Transition {
    constructor(newRegisters, memoryOffset, newMemoryData) {
        this.newRegisters = newRegisters || {}
        this.memoryOffset = memoryOffset
        this.newMemoryData = newMemoryData
    }

    withByteRegister(register, value) {
        this.newRegisters[register] = value & 0xff

        return this
    }

    withCarry(value) {
        this.newRegisters.flagC = value

        return this
    }

    withFlags(value) {
        this.newRegisters.flagP = byteParity(value) !== 0
        this.newRegisters.flagZ = value === 0
        this.newRegisters.flagS = (value & 0x80) !== 0

        return this
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

    withChannelOut(channel, data) {
        this.outChannel = channel
        this.outChannelData = data

        return this
    }

    perform(state) {
        this.oldRegisters = state.registers

        let memory = state.memory
        let videoMemory = state.videoMemory

        if (typeof this.memoryOffset === 'number') {
            if (memory.contains(this.memoryOffset)) {
                this.oldMemoryData = memory.getMemory(this.memoryOffset, this.newMemoryData.length)
                memory = memory.updateData(this.memoryOffset, this.newMemoryData)
            } else if (videoMemory && videoMemory.contains(this.memoryOffset)) {
                this.oldMemoryData = videoMemory.getMemory(this.memoryOffset, this.newMemoryData.length)
                videoMemory = videoMemory.updateData(this.memoryOffset, this.newMemoryData)
            }
        }
        const channels = {}
        if (typeof this.outChannel === 'number') {
            const channel = state[`channel${this.outChannel}`]
            if (channel) {
                channels[`channel${this.outChannel}`] = channel.output(this.outChannelData)
            }
        }

        return state.copy({
            transitions: state.transitions.push(this),
            registers: state.registers.copy(this.newRegisters),
            memory: memory,
            videoMemory: videoMemory,
            totalCycles: typeof this.cycles === 'number' ? state.totalCycles + this.cycles : state.totalCycles
        }, channels)
    }

    undo(state) {
        let memory = state.memory
        let videoMemory = state.videoMemory

        if (typeof this.memoryOffset === 'number') {
            if (memory.contains(this.memoryOffset)) {
                memory = memory.updateData(this.memoryOffset, this.oldMemoryData)
            } else if (videoMemory && videoMemory.contains(this.memoryOffset)) {
                videoMemory = videoMemory.updateData(this.memoryOffset, this.oldMemoryData)
            }
        }

        return state.copy({
            transitions: state.transitions.pop(),
            registers: this.oldRegisters,
            memory: memory,
            videoMemory: videoMemory,
            totalCycles: typeof this.cycles === 'number' ? state.totalCycles - this.cycles : state.totalCycles
        })
    }
}
