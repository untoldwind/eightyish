export default class Immutable {
    constructor() {
        this.isMutable = false
    }

    mutable() {
        return Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {isMutable: true})
    }

    immutable() {
        return Object.freeze(Object.assign({__proto__: Object.getPrototypeOf(this)}, this, {isMutable: false}))
    }

    copy(...changes) {
        if (this.isMutable) {
            return Object.assign(this, ...changes)
        }
        return Object.freeze(Object.assign({__proto__: Object.getPrototypeOf(this)}, this, ...changes))
    }
}
