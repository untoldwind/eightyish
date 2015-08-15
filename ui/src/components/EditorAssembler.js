import React from 'react';

export default class EditorAssembler extends React.Component {
    render() {
        return (
            <pre style={{minHeight: '25em'}}
                 onInput={this.emitChange.bind(this)}
                 onBlur={this.emitChange.bind(this)}
                 contentEditable="true"
                 dangerouslySetInnerHTML={{__html: this.props.sourceCode.assembler}}>
            </pre>
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
