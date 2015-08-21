jest.dontMock('../Switch')

const React = require('react/addons')
const TestUtils = React.addons.TestUtils
const Switch = require('../Switch')

describe('Switch component', () => {
    it('should be on/off depending on value', () => {
        Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {
            configurable: true,
            get: () => 50
        })
        const node = document.createElement('div')
        const valueLink = {
            value: true,
            requestChange: () => {
            }
        }
        let component = React.render(<Switch label="Test" valueLink={valueLink}/>, node)

        expect(component.refs.wrapper.props.className).toContain('bootstrap-switch-on')
        expect(component.refs.label.getDOMNode().textContent).toBe('Test')
        expect(component.refs.label.getDOMNode().style.width).toBe('50px')
        expect(component.refs.on.getDOMNode().style.width).toBe('50px')
        expect(component.refs.off.getDOMNode().style.width).toBe('50px')
        expect(component.refs.wrapper.getDOMNode().style.width).toBe('100px')
        expect(component.refs.container.getDOMNode().style.width).toBe('150px')
        expect(component.refs.container.getDOMNode().style.marginLeft).toBe('0px')

        valueLink.value = false
        component = React.render(<Switch label="Test" valueLink={valueLink}/>, node)

        expect(component.refs.wrapper.props.className).toContain('bootstrap-switch-off')
        expect(component.refs.label.getDOMNode().textContent).toBe('Test')
        expect(component.refs.label.getDOMNode().style.width).toBe('50px')
        expect(component.refs.on.getDOMNode().style.width).toBe('50px')
        expect(component.refs.off.getDOMNode().style.width).toBe('50px')
        expect(component.refs.wrapper.getDOMNode().style.width).toBe('100px')
        expect(component.refs.container.getDOMNode().style.width).toBe('150px')
        expect(component.refs.container.getDOMNode().style.marginLeft).toBe('-50px')
    })

    it('should toggle on click', () => {
        let changedValue = false

        const valueLink = {
            value: false,
            requestChange: (value) => {
                changedValue = value
            }
        }
        const component = TestUtils.renderIntoDocument(
            <Switch label="Test" valueLink={valueLink}/>
        )

        expect(component.refs.wrapper.props.className).toContain('bootstrap-switch-off')
        TestUtils.Simulate.click(component.refs.wrapper)

        expect(changedValue).toBe(true)
    })
})

