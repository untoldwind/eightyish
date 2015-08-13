import React from 'react';

export default class EditorAssembler extends React.Component {
    render() {
        var data = '1\n2\n3\n4\n';
        return (
            <pre onInput={this.emitChange.bind(this)}
                 onBlur={this.emitChange.bind(this)}
                 contentEditable="true"
                 dangerouslySetInnerHTML={{__html: data}}>
            </pre>
        );
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.data !== React.findDOMNode(this).innerHTML;
    }

    componentDidUpdate() {
        if ( this.props.html !== React.findDOMNode(this).innerHTML ) {
            React.findDOMNode(this).innerHTML = this.props.data;
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
