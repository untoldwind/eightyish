
jest.dontMock('../Switch');

const React = require('react/addons');
const TestUtils = React.addons.TestUtils;
const Switch = require('../Switch');

describe('Switch component', () => {
    it('should be on if value is true', () => {
        const valueLink = {
            value: true,
            requestChange: () => {}
        };
        const component = TestUtils.renderIntoDocument(
            <Switch label="Test" valueLink={valueLink}/>
        );

        expect(component.refs.wrapper.props.className).toContain('bootstrap-switch-on');
        expect(component.refs.label.getDOMNode().textContent).toBe('Test');
    });

    it('should be off if value is true', () => {
        const valueLink = {
            value: false,
            requestChange: () => {}
        };
        const component = TestUtils.renderIntoDocument(
            <Switch label="Test" valueLink={valueLink}/>
        );

        expect(component.refs.wrapper.props.className).toContain('bootstrap-switch-off');
    });

    it('should toggle on click', () => {
        let changedValue = false;

        const valueLink = {
            value: false,
            requestChange: (value) => {
                changedValue = value;
            }
        };
        const component = TestUtils.renderIntoDocument(
            <Switch label="Test" valueLink={valueLink}/>
        );

        expect(component.refs.wrapper.props.className).toContain('bootstrap-switch-off');
        TestUtils.Simulate.click(component.refs.wrapper);

        expect(changedValue).toBe(true);
    });
});
