import React from 'react';

export default class EditableValue extends React.Component {
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
        if(this.props.text != this.state.text){
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
        if(event.keyCode === 13) {
            this.finishEditing();
        } else if (event.keyCode === 27) {
            this.cancelEditing();
        }
    }

    render() {
        if(!this.state.editing) {
            return <span className={this.props.className} onClick={this.startEditing}>{this.props.valueLink.value}</span>
        } else {
            return <input className={this.props.activeClassName} onKeyDown={this.keyDown} onBlur={this.finishEditing}
                          defaultValue={this.state.text} onChange={this.textChanged} onReturn={this.finishEditing} />
        }
    }
}

EditableValue.propTypes = {
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    valueLink: React.PropTypes.shape({
        value: React.PropTypes.oneOfType([React.PropTypes.string, ReactPropTypes.number]).isRequired,
        requestChange: React.PropTypes.function.isRequired
    }).isRequired
};