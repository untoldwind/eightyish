import React from 'react';

export default class Switch extends React.Component {
    componentDidMount() {
        this.updateWidths()
    }

    componentDidUpdate() {
        this.updateWidths()
    }

    updateWidths() {
        var width = React.findDOMNode(this.refs.label).offsetWidth;

        React.findDOMNode(this.refs.label).style.width = width + 'px';
        React.findDOMNode(this.refs.on).style.width = width + 'px';
        React.findDOMNode(this.refs.off).style.width = width + 'px';
        React.findDOMNode(this.refs.wrapper).style.width = (2 * width) + 'px';
        React.findDOMNode(this.refs.container).style.width = (3 * width) + 'px';

        if (this.props.valueLink.value) {
            React.findDOMNode(this.refs.container).style.marginLeft = '0px';
        } else {
            React.findDOMNode(this.refs.container).style.marginLeft = (-width) + 'px';
        }
    }

    render() {
        var className = 'bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate ';
        if (this.props.valueLink.value) {
            className += 'bootstrap-switch-on';
        } else {
            className += 'bootstrap-switch-off';
        }
        return (
            <div className={className} ref="wrapper" onClick={this.toggle.bind(this)}>
                <div className="bootstrap-switch-container" ref="container">
                    <span className="bootstrap-switch-handle-on bootstrap-switch-primary" ref ="on">{this.props.onText}</span>
                    <span className="bootstrap-switch-label" ref="label">{this.props.label}</span>
                    <span className="bootstrap-switch-handle-off bootstrap-switch-default" ref ="off">{this.props.offText}</span>
                </div>
            </div>
        );
    }

    toggle() {
        this.props.valueLink.requestChange(!this.props.valueLink.value)
    }
}

Switch.propTypes = {
    onText: React.PropTypes.string.isRequired,
    offText: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    valueLink: React.PropTypes.shape({
        value: React.PropTypes.bool.isRequired,
        requestChange: React.PropTypes.func.isRequired
    }).isRequired
};

Switch.defaultProps = {
    onText: 'ON',
    offText: 'OFF',
    label: '\u00a0'
};