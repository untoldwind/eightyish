import React from 'react';

export default class EditorAssembler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            instructions: this.props.sourceCode.instructions
        };
    }

    componentDidMount() {
        this.updateContent()
    }

    componentDidUpdate() {
        this.updateContent()
    }

    updateContent() {
        var node = React.findDOMNode(this);
        var selection = getSelection();
        var offset = 0;
        if(selection.rangeCount > 0) {
            var range = selection.getRangeAt(0);
            var selectedNode = range.startContainer;
            if (selectedNode.parentNode == node) {
                while( (selectedNode = selectedNode.previousSibling) != null ) {
                    offset++;
                }
            }
        }
        node.innerHTML = this.state.instructions.map(instruction =>
            `<li class="${instruction.type}">${instruction.assembler}</li>`).join('');
        selection.removeAllRanges();
        var child = React.findDOMNode(this).children[offset];
        range = document.createRange();
        range.setStart(child, 0);
        range.setEnd(child, 0);
        selection.addRange(range);
    }

    render() {
        return (
            <ul className="assembler"
                contentEditable="true"
                onBlur={this.emitChange.bind(this)}
                onInput={this.emitChange.bind(this)}/>
        );
    }

    emitChange() {
        var lines = []
        for (var child of React.findDOMNode(this).children) {
            lines.push(child.textContent);
        }
        if (lines.length !== this.state.instructions.length) {
            this.props.sourceCode.compile(lines);
            this.setState({instructions: this.props.sourceCode.instructions});
        }
    }
}

EditorAssembler.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};
