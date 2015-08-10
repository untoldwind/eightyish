
import Registers from './registers';
import SourceCode from './sourcecode';

export default class State {
    constructor(mem_size, video_size) {
        this.registers = new Registers(mem_size);
        this.memory = Array.from(new Array(mem_size), () => 0);
        this.video = Array.from(new Array(video_size), () => 0);
        this.sourceCode = new SourceCode();
    }
}