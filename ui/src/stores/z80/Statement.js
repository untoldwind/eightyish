import Immutable from '../Immutable'

export default class Statement extends Immutable {
    constructor() {
        super()

        this.breakpoint = false
    }

    toggleBreakpoint() {
        return this.copy({
            breakpoint: !this.breakpoint
        })
    }
}

Statement.create = (obj) => Object.freeze(Object.assign(new Statement(), obj))
