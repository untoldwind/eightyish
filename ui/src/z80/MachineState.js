import EventEmitter from 'events';

import Registers from './Registers';
import SourceCode from './SourceCode';

import appDispatcher from '../dispatcher/AppDispatcher';
import * as AppConstants from '../dispatcher/AppConstants';

const CHANGE_EVENT = 'change';

class MachineState extends EventEmitter {
    constructor(mem_size, video_size) {
        super();

        this.registers = new Registers(mem_size);
        this.memory = Array.from(new Array(mem_size), () => 0);
        this.videoOffset = 0x1000;
        this.video = Array.from(new Array(video_size), () => 0);
        this.sourceCode = new SourceCode();
        this.transitions = [];
        this.lastTransition = undefined;

        var sourceMemory = this.sourceCode.memory;
        for (var i = 0; i < sourceMemory.length; i++) {
            this.memory[i] = sourceMemory[i];
        }

        this.dispatchToken = appDispatcher.register(action => {
            switch(action.type) {
            case AppConstants.MACHINE_RESET:
                this.lastTransition = undefined;
                this.transitions = [];
                this.registers = new Registers(mem_size);
                this.memory = Array.from(new Array(mem_size), () => 0);
                this.video = Array.from(new Array(video_size), () => 0);
                this.emitChange();
                break;

            case AppConstants.MACHINE_TRANSITION:
                this.lastTransition = action.transition;
                this.transitions.push(this.lastTransition);
                this.lastTransition.perform(this);
                this.emitChange();
                break;
            }
        });

        this.restore();
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
        if(localStorage != undefined && localStorage.machineState != undefined)  {
            var storedState = JSON.parse(localStorage.machineState);

            Object.assign(this.registers, storedState.registers);
            this.memory = storedState.memory;
            this.video = storedState.video;
        }
    }

    store() {
        if(localStorage != undefined) {
            localStorage.machineState = JSON.stringify({
                registers: this.registers,
                memory: this.memory,
                video: this.video
            });
        }
    }
}

export default new MachineState(1024, 1024)