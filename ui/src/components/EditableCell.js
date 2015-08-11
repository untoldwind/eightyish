import React from 'react';

export default class EditableCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false
        }
    }

    startEditing() {
        console.log('bla');
        console.log(this);
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
            return <span className={this.props.className} onClick={this.startEditing.bind(this)}>
                {this.props.valueLink.value}
            </span>
        } else {
            return <input className={this.props.activeClassName} onKeyDown={this.keyDown.bind(this)}
                          onBlur={this.finishEditing.bind(this)}
                          defaultValue={this.state.text}
                          onChange={this.textChanged.bind(this)} onReturn={this.finishEditing.bind(this)} />
        }
    }
}

EditableCell.propTypes = {
    className: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    valueLink: React.PropTypes.shape({
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
        requestChange: React.PropTypes.func.isRequired
    }).isRequired
};