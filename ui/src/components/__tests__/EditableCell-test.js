jest.dontMock('../EditableCell')

const React = require('react/addons')
const TestUtils = React.addons.TestUtils
const EditableCell = require('../EditableCell')

describe('EditableCell component', () => {
    it('should render value as table cell', () => {
        window.HTMLInputElement.prototype.setSelectionRange = jest.genMockFunction()
        const tr = document.createElement('tr')

        const component = React.render(<EditableCell value="content"/>, tr)
        const td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        expect(td).toBeDefined()
        expect(td.getDOMNode().textContent).toEqual('content')
    })

    it('should show input on click and abort on esc', () => {
        window.HTMLInputElement.prototype.setSelectionRange = jest.genMockFunction()

        const onChange = jest.genMockFunction()
        const tr = document.createElement('tr')

        const component = React.render(<EditableCell value="content" onChange={onChange}/>, tr)
        let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        TestUtils.Simulate.click(td)

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input')

        expect(td).toBeDefined()
        expect(input).toBeDefined()
        expect(input.props.defaultValue).toEqual('content')
        expect(window.HTMLInputElement.prototype.setSelectionRange).toBeCalledWith(0, 7)

        TestUtils.Simulate.keyDown(input, {key: 'Esc', keyCode: 27})

        td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        expect(td).toBeDefined()
        expect(td.getDOMNode().textContent).toEqual('content')
        expect(onChange).not.toBeCalled()
    })

    it('should show input on click and abort on enter if content is not changed', () => {
        window.HTMLInputElement.prototype.setSelectionRange = jest.genMockFunction()

        const onChange = jest.genMockFunction()
        const tr = document.createElement('tr')

        const component = React.render(<EditableCell value="content" onChange={onChange}/>, tr)
        let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        TestUtils.Simulate.click(td)

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input')

        expect(td).toBeDefined()
        expect(input).toBeDefined()
        expect(input.props.defaultValue).toEqual('content')
        expect(window.HTMLInputElement.prototype.setSelectionRange).toBeCalledWith(0, 7)

        TestUtils.Simulate.keyDown(input, {key: 'Enter', keyCode: 13})

        td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        expect(td).toBeDefined()
        expect(td.getDOMNode().textContent).toEqual('content')
        expect(onChange).not.toBeCalled()
    })

    it('should show input on click and send changed content on enter', () => {
        window.HTMLInputElement.prototype.setSelectionRange = jest.genMockFunction()

        const onChange = jest.genMockFunction()
        const tr = document.createElement('tr')

        const component = React.render(<EditableCell value="content" onChange={onChange}/>, tr)
        let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        TestUtils.Simulate.click(td)

        const input = TestUtils.findRenderedDOMComponentWithTag(component, 'input')

        expect(td).toBeDefined()
        expect(input).toBeDefined()
        expect(input.props.defaultValue).toEqual('content')
        expect(window.HTMLInputElement.prototype.setSelectionRange).toBeCalledWith(0, 7)

        input.getDOMNode().value = 'newContent'
        TestUtils.Simulate.change(input)
        TestUtils.Simulate.keyDown(input, {key: 'Enter', keyCode: 13})

        td = TestUtils.findRenderedDOMComponentWithTag(component, 'td')

        expect(td).toBeDefined()
        expect(td.getDOMNode().textContent).toEqual('content')
        expect(onChange).toBeCalledWith('newContent')
    })
})
