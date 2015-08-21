export default class SourceLabels {
    constructor() {
        this.labels = new Map()
    }

    setAddress(label, address) {
        this.labels.set(label, address)
    }

    getAddress(labelOfAddress) {
        switch (typeof labelOfAddress) {
        case 'number':
            return [(labelOfAddress >> 8) & 0xff, labelOfAddress & 0xff]
        case 'string':
            if (labelOfAddress.startsWith('.')) {
                const address = this.labels.get(labelOfAddress)

                if (address) {
                    return [(address >> 8) & 0xff, address & 0xff]
                }
            } else {
                const address = parseInt(labelOfAddress, 16)

                if (address) {
                    return [(address >> 8) & 0xff, address & 0xff]
                }
            }
            return 0
        default:
            return 0
        }
    }
}

