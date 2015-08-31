import * as InstructionSet from './InstructionSet'
import Registers from './Registers'
import SourceCode from './SourceCode'
import Stack from './Stack'

import firmware from './firmware'

export default class MachineState {
    constructor(memSize, videoWidth, videoHeight) {
        this.registers = new Registers(memSize)
        this.memSize = memSize
        this.memory = Array.from(new Array(memSize), () => 0)
        this.videoOffset = 0x1000
        this.videoWidth = videoWidth
        this.videoHeight = videoHeight
        this.videoMemory = null
        this.sourceCode = new SourceCode(0)
        this.firmwareOffset = 0x8000
        this.firmwareMemory = []
        this.firmwareSource = new SourceCode(this.firmwareOffset)
        this.breakpoints = new Set()
        this.transitions = new Stack()
        this.totalCycles = 0
        this.running = false

        this.restore()

        this.compileFirmware(firmware)

        this.transferSourceToMemory()
    }

    reset() {
        return this.copy({
            transitions: new Stack(),
            totalCycles: 0,
            running: false,
            memory: Array.from(new Array(this.memSize), () => 0),
            registers: new Registers(this.memSize),
            videoMemory: this.videoMemory ?
                Array.from(new Array(this.videoWidth * this.videoHeight / 8), () => 0) : null
        }).transferSourceToMemory()
    }

    moveToBegin() {
        return this.copy({
            transitions: new Stack(),
            totalCycles: 0,
            running: false,
            registers: new Registers(this.memSize)
        })
    }

    stepForward() {
        let transition = InstructionSet.process(this)
        if (transition) {
            const nextState = transition.perform(this)
            if (this.running && this.breakpoints.has(nextState.registers.PC)) {
                return nextState.stop()
            }
            return nextState
        } else {
            return this.stop()
        }
    }

    fastForward() {
        let currentState = this
        let transition
        while ((transition = InstructionSet.process(currentState)) !== null) {
            currentState = transition.perform(currentState)
            if (this.breakpoints.has(currentState.registers.PC)) {
                return currentState
            }
        }
        return currentState
    }

    stepBackward() {
        const transition = this.transitions.peek()
        if (transition) {
            return transition.undo(this)
        }
        return this
    }

    start() {
        return this.copy({
            transitions: new Stack(),
            totalCycles: 0,
            running: true,
            registers: new Registers(this.memSize)
        })
    }

    stop() {
        if (!this.running) {
            return this
        }
        return this.copy({
            running: false
        })
    }

    toggleVideo(videoEnabled) {
        if (videoEnabled && !(this.videoMemory instanceof Array)) {
            return this.copy({
                videoMemory: Array.from(new Array(this.videoWidth * this.videoHeight / 8), () => 0)
            })
        } else if (!videoEnabled) {
            return this.copy({
                videoMemory: null
            })
        }
        return this
    }

    compile(lines) {
        this.sourceCode.compile(lines)
        return this.transferSourceToMemory()
    }

    toggleBreakpoint(address) {
        this.sourceCode.toggleBreakpoint(address)
        return this.transferSourceToMemory()
    }

    getMemory(offset, length) {
        if (offset < this.memory.length) {
            return this.memory.slice(offset, offset + length)
        }
        if (this.hasVideo && offset >= this.videoOffset && offset - this.videoOffset < this.videoMemory.length) {
            return this.video.slice(offset - this.videoOffset, offset + length)
        }
        return []
    }

    getMemoryByte(address) {
        if (address < this.memory.length) {
            return this.memory[address]
        }
        if (this.hasVideo && address >= this.videoOffset && address - this.videoOffset < this.videoMemory.length) {
            return this.video[address - this.videoOffset]
        }
        return 0
    }

    getMemoryWord(address) {
        if (address < this.memory.length) {
            return (this.memory[address] << 8) | this.memory[address + 1]
        }
        if (this.hasVideo && address >= this.videoOffset && address - this.videoOffset < this.videoMemory.length) {
            return (this.video[address - this.videoOffset] << 8) | this.video[address - this.videoOffset + 1]
        }
        return 0
    }

    compileFirmware(lines) {
        this.firmwareSource.compile(lines)
        this.firmwareMemory = this.firmwareSource.memoryAndBreakpoints[0]
    }

    transferSourceToMemory() {
        const [sourceMemory, sourceBreakpoints] = this.sourceCode.memoryAndBreakpoints

        return this.copy({
            memory: Array.from(this.memory, (v, offset) => offset < sourceMemory.length ? sourceMemory[offset] : v),
            breakpoints: new Set(sourceBreakpoints)
        })
    }

    get hasVideo() {
        return this.videoMemory instanceof Array
    }

    copy(...changes) {
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, ...changes)
    }

    restore() {
        if (localStorage && localStorage.machineState) {
            let storedState = JSON.parse(localStorage.machineState)

            Object.assign(this.registers, storedState.registers)
            this.memory = storedState.memory
            this.videoMemory = storedState.videoMemory
            this.sourceCode.compile(storedState.assembler)
        }
    }

    store() {
        if (localStorage) {
            localStorage.machineState = JSON.stringify({
                registers: this.registers,
                memory: this.memory,
                videoMemory: this.videoMemory,
                assembler: this.sourceCode.assembler
            })
        }
    }
}
