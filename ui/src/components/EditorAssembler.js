import React from 'react';

export default class EditorAssembler extends React.Component {
    render() {
        return (
            <pre contentEditable="true"
                 dangerouslySetInnerHTML={{__html: this.props.sourceCode.assembler}}
                 onBlur={this.emitChange.bind(this)}
                 onInput={this.emitChange.bind(this)}
                 style={{minHeight: '30em', border: 'none'}}/>
        );
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.data !== React.findDOMNode(this).innerHTML;
    }

    componentDidUpdate() {
        var assembler = this.props.sourceCode.assembler;
        if ( assembler !== React.findDOMNode(this).innerHTML ) {
            React.findDOMNode(this).innerHTML = assembler;
        }
    }

    emitChange(evt) {
        var data = React.findDOMNode(this).innerHTML;
        if (this.props.onChange && data !== this.lastData) {
            evt.target = { value: data };
            this.props.onChange(evt);
        }
        this.lastData = data;
    }
}

EditorAssembler.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};