import EventEmitter from 'events';

import Registers from './Registers';
import SourceCode from './SourceCode';

import appDispatcher from '../dispatcher/AppDispatcher';
import * as AppConstants from '../dispatcher/AppConstants';

const CHANGE_EVENT = 'change';

class MachineState extends EventEmitter {
    constructor(memSize, videoWidth, videoHeight) {
        super();

        this.registers = new Registers(memSize);
        this.memory = Array.from(new Array(memSize), () => 0);
        this.videoOffset = 0x1000;
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;
        this.videoMemory = undefined;
        this.sourceCode = new SourceCode();
        this.transitions = [];
        this.lastTransition = undefined;

        var sourceMemory = this.sourceCode.memory;
        for (var i = 0; i < sourceMemory.length; i++) {
            this.memory[i] = sourceMemory[i];
        }

        this.dispatchToken = appDispatcher.register(action => {
            switch (action.type) {
            case AppConstants.MACHINE_RESET:
                this.lastTransition = undefined;
                this.transitions = [];
                this.registers = new Registers(memSize);
                this.memory = Array.from(new Array(memSize), () => 0);
                if (this.videoMemory != undefined) {
                    this.videoMemory = Array.from(new Array(videoWidth * videoHeight / 8), () => 0);
                }
                this.emitChange();
                break;

            case AppConstants.MACHINE_TRANSITION:
                this.lastTransition = action.transition;
                this.transitions.push(this.lastTransition);
                this.lastTransition.perform(this);
                this.emitChange();
                break;
            case AppConstants.MACHINE_TOGGLE_VIDEO:
                if (action.videoEnabled && this.videoMemory == undefined) {
                    this.videoMemory = Array.from(new Array(videoWidth * videoHeight / 8), () => 0)
                    this.emitChange();
                } else if(!action.videoEnabled){
                    this.videoMemory = undefined
                    this.emitChange();
                }
                break;
            }
        });

        this.restore();
    }

    get hasVideo() {
        return this.videoMemory != undefined
    }

    emitChange() {
        this.store();
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    restore() {
        if (localStorage != undefined && localStorage.machineState != undefined) {
            var storedState = JSON.parse(localStorage.machineState);

            Object.assign(this.registers, storedState.registers);
            this.memory = storedState.memory;
            this.videoMemory = storedState.videoMemory;
            this.sourceCode.compile(storedState.assembler);
        }
    }

    store() {
        if (localStorage != undefined) {
            localStorage.machineState = JSON.stringify({
                registers: this.registers,
                memory: this.memory,
                videoMemory: this.videoMemory,
                assembler: this.sourceCode.assembler
            });
        }
    }
}

export default new MachineState(1024, 128, 64)