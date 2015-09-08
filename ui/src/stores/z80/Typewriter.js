import Immutable from '../Immutable'

import {repeat} from '../../util/formats'

export default class Typewriter extends Immutable {
    constructor() {
        super()
        this.lines = [""]
        this.position = 0
    }

    output(ch) {
        if (ch === 10) {
            return this.copy({
                lines: this.lines.concat("")
            })
        }
        if (ch === 13) {
            return this.copy({
                position: 0
            })
        }
        if (ch >= 32 && ch < 128) {
            let currentLine = this.lines[this.lines.length - 1]

            if (currentLine.length < this.position) {
                currentLine += repeat(' ',  this.position - currentLine.length)
            }
            currentLine = currentLine.substr(0, this.position) +
                String.fromCharCode(ch) + currentLine.substr(this.position + 1)
            return this.copy({
                lines: this.lines.slice(0, this.lines.length - 1).concat(currentLine),
                position: this.position + 1
            })
        }
        return this
    }
}

Typewriter.create = () => Object.freeze(new Typewriter())
