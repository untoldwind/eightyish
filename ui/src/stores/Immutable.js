export default class Immutable {
    copy(...changes) {
        return Object.freeze(Object.assign({__proto__: Object.getPrototypeOf(this)}, this, ...changes))
    }
}
