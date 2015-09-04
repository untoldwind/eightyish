import Immutable from '../Immutable'

export default class MemoryBlock extends Immutable {
    constructor(offset, size) {
        super()

        this.offset = offset
        this.data = new Uint8Array(size)
    }

    contains(address) {
        return address >= this.offset && address - this.offset < this.data.length
    }

    getByte(address) {
        return this.data[address - this.offset]
    }

    getWord(address) {
        return (this.data[address - this.offset] << 8) | this.data[address - this.offset + 1]
    }

    getMemory(address, length) {
        return this.data.subarray(address - this.offset, address - this.offset + length)
    }

    replaceData(newData) {
        return this.copy({
            data: new Uint8Array(newData)
        })
    }

    updateData(address, changes) {
        const newData = new Uint8Array(this.data)

        newData.set(changes, address - this.offset)

        return this.copy({
            data: newData
        })
    }

    clear() {
        return this.copy({
            data: new Uint8Array(this.data.length)
        })
    }
}

MemoryBlock.create = (offset, size) => Object.freeze(new MemoryBlock(offset, size))
