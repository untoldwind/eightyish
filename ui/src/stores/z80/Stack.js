export default class Stack {
    constructor(elements = []) {
        this.elements = elements
    }

    peek() {
        if (this.elements.length > 0) {
            return this.elements[this.elements.length - 1]
        }
        return null
    }

    push(element) {
        return new Stack(this.elements.concat(element))
    }

    pop() {
        if (this.elements.length > 0) {
            return new Stack(this.elements.slice(0, this.elements.length - 1))
        }
        return this
    }
}
