import React from 'react';

export default class EditorAssembler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assember: this.props.sourceCode.assembler
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
        //var selection = getSelection();
        //var offset = 0;
        //if(selection.rangeCount > 0) {
        //    var range = selection.getRangeAt(0);
        //    offset = range.startOffset;
        //}
        node.innerHTML = this.state.assember;
        //selection.removeAllRanges();
        //range = document.createRange();
        //range.setStart(node.firstChild, offset);
        //range.setEnd(node.firstChild, offset);
        //selection.addRange(range);
    }

    render() {
        return (
            <pre contentEditable="true"
                 onBlur={this.emitChange.bind(this)}
                 onInput={this.emitChange.bind(this)}
                 style={{minHeight: '30em', border: 'none'}}/>
        );
    }

    emitChange() {
        var data = React.findDOMNode(this).innerHTML;
        console.log(data);
        console.log(getSelection(React.findDOMNode(this)).getRangeAt(0));
        if (data !== this.state.assember) {
            this.props.sourceCode.compile(data);
            this.setState({assember: this.props.sourceCode.assembler});
        }
    }
}

EditorAssembler.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};
