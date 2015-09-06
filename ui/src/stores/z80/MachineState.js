import * as InstructionSet from './InstructionSet'
import Registers from './Registers'
import SourceCode from './SourceCode'
import Stack from './Stack'
import MemoryBlock from './MemoryBlock'
import Immutable from '../Immutable'

import firmware from './firmware'

export default class MachineState extends Immutable {
    constructor(memSize, videoWidth, videoHeight) {
        super()

        this.registers = Registers.create(memSize)
        this.memSize = memSize
        this.memory = MemoryBlock.create(0, memSize)
        this.videoOffset = 0x1000
        this.videoWidth = videoWidth
        this.videoHeight = videoHeight
        this.videoMemory = null
        this.sourceCode = SourceCode.create(0)
        this.firmwareOffset = 0x8000
        this.firmwareMemory = MemoryBlock.create(this.firmwareOffset, 0)
        this.firmwareSource = SourceCode.create(this.firmwareOffset)
        this.breakpoints = new Set()
        this.transitions = Stack.create()
        this.totalCycles = 0
        this.running = false
    }

    reset() {
        return this.copy({
            transitions: Stack.create(),
            totalCycles: 0,
            running: false,
            memory: this.memory.clear(),
            registers: Registers.create(this.memSize),
            videoMemory: this.videoMemory ? this.videoMemory.clear() : null
        }).transferSourceToMemory().store()
    }

    moveToBegin() {
        return this.copy({
            transitions: Stack.create(),
            totalCycles: 0,
            running: false,
            registers: Registers.create(this.memSize)
        }).store()
    }

    stepForward(until = (pc) => this.breakpoints.has(pc)) {
        let transition = InstructionSet.process(this)
        if (transition) {
            const nextState = transition.perform(this)
            if (this.running) {
                if (until(nextState.registers.PC)) {
                    return nextState.stop().store()
                }
                if (nextState.registers.PC >= 0x1000) {
                    return nextState.fastForward((pc) => pc < 0x1000)
                }
            }
            return nextState.store()
        }
        return this.stop().store()
    }

    fastForward(until = (pc) => this.breakpoints.has(pc)) {
        let currentState = this
        let transition
        while ((transition = InstructionSet.process(currentState)) !== null) {
            currentState = transition.perform(currentState)
            if (until(currentState.registers.PC)) {
                return currentState.store()
            }
        }
        return currentState.store()
    }

    stepBackward() {
        const transition = this.transitions.peek()
        if (transition) {
            return transition.undo(this).store()
        }
        return this
    }

    start() {
        return this.copy({
            running: true
        }).store()
    }

    stop() {
        if (!this.running) {
            return this
        }
        return this.copy({
            running: false
        }).store()
    }

    toggleVideo(videoEnabled) {
        if (videoEnabled && !(this.videoMemory instanceof MemoryBlock)) {
            return this.copy({
                videoMemory: MemoryBlock.create(this.videoOffset, this.videoWidth * this.videoHeight / 8)
            }).store()
        } else if (!videoEnabled) {
            return this.copy({
                videoMemory: null
            }).store()
        }
        return this
    }

    compile(lines) {
        const sourceCode = this.sourceCode.compile(lines, this.firmwareSource.labels)

        return this.copy({
            sourceCode: sourceCode
        }).transferSourceToMemory().store()
    }

    toggleBreakpoint(address) {
        const sourceCode = this.sourceCode.toggleBreakpoint(address)

        return this.copy({
            sourceCode: sourceCode
        }).transferSourceToMemory().store()
    }

    getMemory(address, length) {
        if (this.memory.contains(address)) {
            return this.memory.getMemory(address, length)
        }
        if (this.firmwareMemory.contains(address)) {
            return this.firmwareMemory.getMemory(address, length)
        }
        if (this.videoMemory && this.videoMemory.contains(address)) {
            return this.videoMemory.getMemory(address, length)
        }
        return []
    }

    getMemoryByte(address) {
        if (this.memory.contains(address)) {
            return this.memory.getByte(address)
        }
        if (this.firmwareMemory.contains(address)) {
            return this.firmwareMemory.getByte(address)
        }
        if (this.videoMemory && this.videoMemory.contains(address)) {
            return this.videoMemory.getByte(address)
        }
        return 0
    }

    getMemoryWord(address) {
        if (this.memory.contains(address)) {
            return this.memory.getWord(address)
        }
        if (this.firmwareMemory.contains(address)) {
            return this.firmwareMemory.getWord(address)
        }
        if (this.videoMemory && this.videoMemory.contains(address)) {
            return this.videoMemory.getWord(address)
        }
        return 0
    }

    compileFirmware(lines) {
        const firmwareSource = this.firmwareSource.compile(lines)
        const [firmwareMemory, firmwareBreakpoints] = firmwareSource.memoryAndBreakpoints
        return this.copy({
            firmwareSource: firmwareSource,
            firmwareMemory: this.firmwareMemory.replaceData(firmwareMemory)
        })
    }

    transferSourceToMemory() {
        const [sourceMemory, sourceBreakpoints] = this.sourceCode.memoryAndBreakpoints

        return this.copy({
            memory: this.memory.updateData(0, sourceMemory),
            breakpoints: new Set(sourceBreakpoints)
        })
    }

    get hasVideo() {
        return this.videoMemory instanceof MemoryBlock
    }

    restore() {
        if (localStorage && localStorage.machineState) {
            const storedState = JSON.parse(localStorage.machineState)
            const sourceCode = this.sourceCode.compile(storedState.assembler, this.firmwareSource.labels)
            const [sourceMemory, sourceBreakpoints] = sourceCode.memoryAndBreakpoints

            return this.copy({
                registers: this.registers.copy(storedState.registers),
                sourceCode: sourceCode,
                memory: this.memory.updateData(0, storedState.memory).updateData(0, sourceMemory),
                breakpoints: new Set(sourceBreakpoints),
                videoMemory: storedState.videoMemory ?
                    MemoryBlock.create(this.videoOffset, this.videoWidth * this.videoHeight / 8)
                        .updateData(this.videoOffset, storedState.videoMemory) : null
            })
        }
        return this
    }

    store() {
        if (localStorage) {
            localStorage.machineState = JSON.stringify({
                registers: this.registers,
                memory: Array.from(this.memory.data),
                videoMemory: this.hasVideo ? Array.from(this.videoMemory.data) : null,
                assembler: this.sourceCode.assembler
            })
        }
        return this
    }
}

MachineState.create = (memSize, videoWidth, videoHeight) =>
    Object.freeze(new MachineState(memSize, videoWidth, videoHeight)).compileFirmware(firmware)
