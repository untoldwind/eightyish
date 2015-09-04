import React from 'react'

import shallowEqual from '../util/shallowEqual'

export default class EditableCell extends React.Component {
    static propTypes = {
        activeClassName: React.PropTypes.string,
        className: React.PropTypes.string,
        id: React.PropTypes.string,
        onChange: React.PropTypes.func,
        rowSpan: React.PropTypes.number,
        style: React.PropTypes.object,
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            editing: false
        }
    }

    startEditing() {
        this.setState({editing: true, text: this.props.value})
    }

    finishEditing() {
        if (this.props.value !== this.state.text) {
            this.commitEditing()
        } else if (this.props.value === this.state.text) {
            this.cancelEditing()
        }
    }

    commitEditing() {
        if (this.props.onChange) {
            this.props.onChange(this.state.text)
        }
        this.setState({editing: false})
    }

    cancelEditing() {
        this.setState({editing: false})
    }

    textChanged(event) {
        this.setState({
            text: event.target.value.trim()
        })
    }

    keyDown(event) {
        if (event.keyCode === 13) {
            this.finishEditing()
        } else if (event.keyCode === 27) {
            this.cancelEditing()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const inputElem = React.findDOMNode(this.refs.input)
        if (this.state.editing && !prevState.editing) {
            inputElem.focus()
            inputElem.setSelectionRange(0, inputElem.value.length)
        } else if (this.state.editing && prevProps.value !== this.props.value) {
            this.finishEditing()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps, true) || !shallowEqual(this.state, nextState)
    }

    render() {
        if (!this.state.editing) {
            return (
                <td className={this.props.className}
                    id={this.props.id}
                    onClick={this.startEditing.bind(this)}
                    rowSpan={this.props.rowSpan}
                    style={this.props.style}>
                    {this.props.value}
                </td>
            )
        }
        return (
            <td className={this.props.className}
                id={this.props.id}
                onClick={this.startEditing.bind(this)}
                rowSpan={this.props.rowSpan}
                style={this.props.style}>
                <input className={this.props.activeClassName}
                       defaultValue={this.state.text}
                       onBlur={this.finishEditing.bind(this)}
                       onChange={this.textChanged.bind(this)}
                       onKeyDown={this.keyDown.bind(this)}
                       onReturn={this.finishEditing.bind(this)}
                       ref="input"
                       size={this.props.value.length}/>
            </td>
        )
    }
}
