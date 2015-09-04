import React from 'react'

import shallowEqual from '../util/shallowEqual'

export default class Switch extends React.Component {
    static propTypes = {
        onText: React.PropTypes.string.isRequired,
        offText: React.PropTypes.string.isRequired,
        id: React.PropTypes.string,
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.bool.isRequired,
        onChange: React.PropTypes.func
    }

    static defaultProps = {
        onText: 'ON',
        offText: 'OFF',
        label: '\u00a0'
    }

    componentDidMount() {
        this.updateWidths()
    }

    componentDidUpdate() {
        this.updateWidths()
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props, nextProps, true)
    }

    updateWidths() {
        const width = React.findDOMNode(this.refs.label).offsetWidth

        React.findDOMNode(this.refs.label).style.width = width + 'px'
        React.findDOMNode(this.refs.on).style.width = width + 'px'
        React.findDOMNode(this.refs.off).style.width = width + 'px'
        React.findDOMNode(this.refs.wrapper).style.width = (2 * width) + 'px'
        React.findDOMNode(this.refs.container).style.width = (3 * width) + 'px'

        if (this.props.value) {
            React.findDOMNode(this.refs.container).style.marginLeft = '0px'
        } else {
            React.findDOMNode(this.refs.container).style.marginLeft = (-width) + 'px'
        }
    }

    render() {
        let className = 'bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate '
        if (this.props.value) {
            className += 'bootstrap-switch-on'
        } else {
            className += 'bootstrap-switch-off'
        }
        return (
            <div className={className} id={this.props.id} onClick={this.toggle.bind(this)} ref="wrapper">
                <div className="bootstrap-switch-container" ref="container">
                    <span className="bootstrap-switch-handle-on bootstrap-switch-primary" ref="on">
                        {this.props.onText}
                    </span>
                    <span className="bootstrap-switch-label" ref="label">
                        {this.props.label}
                    </span>
                    <span className="bootstrap-switch-handle-off bootstrap-switch-default" ref="off">
                        {this.props.offText}
                    </span>
                </div>
            </div>
        )
    }

    toggle() {
        if (this.props.onChange) {
            this.props.onChange(!this.props.value)
        }
    }
}
