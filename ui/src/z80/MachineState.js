import EventEmitter from 'events'

import * as InstructionSet from './InstructionSet'
import Registers from './Registers'
import SourceCode from './SourceCode'

import appDispatcher from '../dispatcher/AppDispatcher'
import * as AppConstants from '../dispatcher/AppConstants'

const CHANGE_EVENT = 'change'

class MachineState extends EventEmitter {
    constructor(memSize, videoWidth, videoHeight) {
        super()

        this.registers = new Registers(memSize)
        this.memSize = memSize
        this.memory = Array.from(new Array(memSize), () => 0)
        this.videoOffset = 0x1000
        this.videoWidth = videoWidth
        this.videoHeight = videoHeight
        this.videoMemory = null
        this.sourceCode = new SourceCode()
        this.transitions = []
        this.totalCycles = 0
        this.running = false

        appDispatcher.register(this.handleAction.bind(this))

        this.restore()

        this.transferSourceToMemory()
    }

    handleAction(action) {
        switch (action.type) {
        case AppConstants.MACHINE_RESET:
            this.reset()
            break

        case AppConstants.MACHINE_START:
            this.start()
            break

        case AppConstants.MACHINE_STOP:
            this.stop()
            break

        case AppConstants.MACHINE_MOVE_TO_BEGIN:
            this.moveToBegin()
            break

        case AppConstants.MACHINE_STEP_FORWARD:
            this.stepForward()
            break

        case AppConstants.MACHINE_STEP_BACKWARD:
            this.stepBackward()
            break

        case AppConstants.MACHINE_TRANSITION:
            this.pushTransition(action.transition)
            break

        case AppConstants.MACHINE_TOGGLE_VIDEO:
            this.toggleVideo(action.videoEnabled)
            break

        case AppConstants.MACHINE_COMPILE:
            this.compile(action.lines)
            break

        default:
            break
        }
    }

    reset() {
        this.transitions = []
        this.totalCycles = 0
        this.running = false
        this.registers = new Registers(this.memSize)
        this.memory = Array.from(new Array(this.memSize), () => 0)
        if (this.videoMemory) {
            this.videoMemory = Array.from(new Array(this.videoWidth * this.videoHeight / 8), () => 0)
        }
        this.transferSourceToMemory()
        this.emitChange()
    }

    moveToBegin() {
        this.transitions = []
        this.totalCycles = 0
        this.running = false
        this.registers = new Registers(this.memSize)
        this.emitChange()
    }

    stepForward() {
        let transition = InstructionSet.process(this)
        if (transition) {
            this.transitions.push(transition)
            transition.perform(this)
            this.emitChange()
            if (this.running) {
                setTimeout(this.stepForward.bind(this), 10)
            }
        } else {
            this.stop()
        }
    }

    stepBackward() {
        let transition = this.transitions.pop()
        if (transition) {
            transition.undo(this)
            this.emitChange()
        }
    }

    start() {
        clearTimeout(this.timer)
        this.transitions = []
        this.totalCycles = 0
        this.running = true
        this.registers = new Registers(this.memSize)
        this.emitChange()
        setTimeout(this.stepForward.bind(this), 10)
    }

    stop() {
        clearTimeout(this.timer)
        this.running = false
        this.emitChange()
    }

    pushTransition(transition) {
        this.transitions.push(transition)
        transition.perform(this)
        this.emitChange()
    }

    toggleVideo(videoEnabled) {
        if (videoEnabled && !(this.videoMemory instanceof Array)) {
            this.videoMemory = Array.from(new Array(this.videoWidth * this.videoHeight / 8), () => 0)
            this.emitChange()
        } else if (!videoEnabled) {
            this.videoMemory = null
            this.emitChange()
        }
    }

    compile(lines) {
        this.sourceCode.compile(lines)
        this.transferSourceToMemory()
        this.emitChange()
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

    transferSourceToMemory() {
        let sourceMemory = this.sourceCode.memory
        for (let i = 0; i < sourceMemory.length; i++) {
            this.memory[i] = sourceMemory[i]
        }
    }

    get hasVideo() {
        return this.videoMemory instanceof Array
    }

    emitChange() {
        this.store()
        this.emit(CHANGE_EVENT)
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback)
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback)
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

export default new MachineState(1024, 128, 64)
