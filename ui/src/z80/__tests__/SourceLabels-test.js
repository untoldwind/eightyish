import 'babel/polyfill'

jest.autoMockOff()

const SourceLabels = require('../SourceLabels')

describe('SourceLabels', () => {
    it('should get/setAddress', () => {
        const labels = new SourceLabels()

        labels.setAddress('.aLabel', 0x1234)
        expect(labels.getAddress('.aLabel')).toEqual([0x12, 0x34])
        expect(labels.getAddress('.something')).toEqual([0, 0])
    })

    it('should return direct addresses', () => {
        const labels = new SourceLabels()

        expect(labels.getAddress(0x1234)).toEqual([0x12, 0x34])
        expect(labels.getAddress('0x1234')).toEqual([0x12, 0x34])
    })
})
