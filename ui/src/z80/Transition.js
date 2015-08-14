
export default class Transition {
    constructor(newRegisters, memoryOffset, newMemoryData) {
        this.newRegisters = newRegisters;
        this.memoryOffset = memoryOffset;
        this.newMemoryData = newMemoryData;
    }

    perform(state) {
        this.oldRegisters = state.registers.copy();
        state.registers.assign(this.newRegisters);
        if (typeof this.memoryOffset == 'number') {
            if(this.memoryOffset < state.memory.length) {
                this.oldMemoryData = state.memory.slice(this.memoryOffset,
                    this.memoryOffset + this.newMemoryData.length);
                for(var i = 0; i < this.newMemoryData.length; i++) {
                    state.memory[this.memoryOffset + i] = this.newMemoryData[i]
                }
            } else if(this.memoryOffset - state.videoOffset < state.video.length) {
                this.oldMemoryData = state.video.slice(this.memoryOffset - state.videoOffset,
                    this.memoryOffset - state.videoOffset + this.newMemoryData.length)
                for(var i = 0; i < this.newMemoryData.length; i++) {
                    state.video[this.memoryOffset - state.videoOffset + i] = this.newMemoryData[i]
                }
            }
        }
    }

    undo(state) {
        state.registers.assign(this.oldRegisters);
        if (typeof this.memoryOffset == 'number') {
            if(this.memoryOffset < state.memory.length) {
                for(var i = 0; i < this.oldMemoryData.length; i++) {
                    state.memory[this.memoryOffset + i] = this.oldMemoryData[i]
                }
            } else if(this.memoryOffset - state.videoOffset < state.video.length) {
                for(var i = 0; i < this.oldMemoryData.length; i++) {
                    state.video[this.memoryOffset - state.videoOffset + i] = this.oldMemoryData[i]
                }
            }
        }
    }
}