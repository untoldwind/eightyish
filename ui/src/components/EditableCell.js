import React from 'react';

export default class EditableCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false
        }
    }

    startEditing() {
        this.setState({editing: true, text: this.props.valueLink.value});
    }

    finishEditing() {
        if (this.props.text != this.state.text) {
            this.commitEditing();
        } else if (this.props.text === this.state.text) {
            this.cancelEditing();
        }
    }

    commitEditing() {
        this.props.valueLink.requestChange(this.state.text);
        this.setState({editing: false});
    }

    cancelEditing() {
        this.setState({editing: false});
    }

    textChanged(event) {
        this.setState({
            text: event.target.value.trim()
        })
    }

    keyDown(event) {
        if (event.keyCode === 13) {
            this.finishEditing();
        } else if (event.keyCode === 27) {
            this.cancelEditing();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        var inputElem = React.findDOMNode(this.refs.input);
        if (this.state.editing && !prevState.editing) {
            inputElem.focus();
            inputElem.setSelectionRange(0, inputElem.value.length);
        } else if (this.state.editing && prevProps.text != this.props.text) {
            this.finishEditing();
        }
    }

    render() {
        if (!this.state.editing) {
            return (
                <td className={this.props.className} rowSpan={this.props.rowSpan} style={this.props.style}
                    onClick={this.startEditing.bind(this)}>
                    {this.props.valueLink.value}
                </td>
            )
        } else {
            return (
                <td className={this.props.className} rowSpan={this.props.rowSpan} style={this.props.style}
                    onClick={this.startEditing.bind(this)}>
                    <input className={this.props.activeClassName} onKeyDown={this.keyDown.bind(this)}
                           defaultValue={this.state.text}
                           onBlur={this.finishEditing.bind(this)}
                           onChange={this.textChanged.bind(this)} onReturn={this.finishEditing.bind(this)}
                           size={this.props.valueLink.value.length}
                           ref="input"/>
                </td>
            )
        }
    }
}

EditableCell.propTypes = {
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    valueLink: React.PropTypes.shape({
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
        requestChange: React.PropTypes.func.isRequired
    }).isRequired,
    rowSpan: React.PropTypes.number,
    style: React.PropTypes.object
};
