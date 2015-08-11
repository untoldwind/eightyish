import EventEmitter from 'events';

import Registers from './Registers';
import SourceCode from './SourceCode';

const CHANGE_EVENT = 'change';

export default class State extends EventEmitter {
    constructor(mem_size, video_size) {
        super();

        this.registers = new Registers(mem_size);
        this.memory = Array.from(new Array(mem_size), () => 0);
        this.video = Array.from(new Array(video_size), () => 0);
        this.sourceCode = new SourceCode();
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }
    
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
}