import Immutable from '../Immutable'

export default class Stack extends Immutable {
    constructor() {
        super()
        this.elements = []
    }

    peek() {
        if (this.elements.length > 0) {
            return this.elements[this.elements.length - 1]
        }
        return null
    }

    push(element) {
        if (this.isMutable) {
            elements.push(element)
            return this
        }
        return this.copy({
            elements: this.elements.concat(element)
        })
    }

    pop() {
        if (this.elements.length > 0) {
            return this.copy({
                elements: this.elements.slice(0, this.elements.length - 1)
            })
        }
        return this
    }
}

Stack.create = () => Object.freeze(new Stack())
