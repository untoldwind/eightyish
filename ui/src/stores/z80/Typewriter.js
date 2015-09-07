import Immutable from '../Immutable'

export default class Typewriter extends Immutable {
    constructor() {
        super()
        this.lines = [""]
        this.position = 0
    }

    output(ch) {
        if (ch == '\n') {
            return this.copy({
                lines: lines.concat("")
            })
        }
        if (ch == '\r') {
            return this.copy({
                position: 0
            })
        }
        if (ch >= 32 && ch < 128) {

        }
        return this
    }
}
