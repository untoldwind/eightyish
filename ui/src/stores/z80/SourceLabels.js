export default class SourceLabels extends Map {
    constructor(labels) {
        super(labels)
    }

    setAddress(label, address) {
        this.set(label, address)
    }

    getAddress(labelOfAddress) {
        switch (typeof labelOfAddress) {
        case 'number':
            return [(labelOfAddress >> 8) & 0xff, labelOfAddress & 0xff]
        case 'string':
            if (labelOfAddress.startsWith('.')) {
                const address = this.get(labelOfAddress)

                if (address) {
                    return [(address >> 8) & 0xff, address & 0xff]
                }
            } else {
                const address = parseInt(labelOfAddress, 16)

                if (address) {
                    return [(address >> 8) & 0xff, address & 0xff]
                }
            }
            return [0, 0]
        default:
            return [0, 0]
        }
    }
}

