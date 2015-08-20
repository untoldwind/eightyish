import React from 'react';

import * as MachineActions from '../actions/MachineActions';

export default class EditorAssembler extends React.Component {

    componentDidMount() {
        this.updateContent();
    }

    componentDidUpdate() {
        this.updateContent();
    }

    updateContent() {
        const selectedLine = this.getSelectedLine();
        React.findDOMNode(this).innerHTML = this.props.sourceCode.instructions.map(instruction =>
            `<li class="${instruction.type}">${instruction.assembler}</li>`).join('');
        this.setSelectedLine(selectedLine);
    }

    getSelectedLine() {
        let selectedLine = -1;
        if (window.getSelection != undefined) {
            const parent = React.findDOMNode(this);
            const selection = getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                let selectedNode = range.startContainer;
                if (selectedNode.nodeType != Node.ELEMENT_NODE) {
                    selectedNode = selectedNode.parentNode;
                }
                if (selectedNode.parentNode == parent) {
                    selectedLine = 0;
                    while ((selectedNode = selectedNode.previousSibling) != null) {
                        selectedLine++;
                    }
                }
            }
        }
        return selectedLine;
    }

    setSelectedLine(line) {
        if (line < 0) {
            return;
        }
        if (window.getSelection != undefined && document.createRange != undefined) {
            const selection = getSelection();
            selection.removeAllRanges();
            const children = React.findDOMNode(this).children;
            if (line < children.length) {
                const range = document.createRange();
                range.setStart(children[line], 1);
                range.setEnd(children[line], 1);
                selection.addRange(range);
            }
        }
    }

    render() {
        return (
            <ul className="assembler"
                contentEditable="true"
                onBlur={this.handleBlur.bind(this)}
                onInput={this.handleInput.bind(this)}/>
        );
    }

    handleBlur() {
        this.emitChange(true);
    }

    handleInput() {
        this.emitChange(false);
    }

    emitChange(force) {
        const lines = [];
        for (let child of React.findDOMNode(this).children) {
            lines.push(child.textContent);
        }
        if (force || lines.length !== this.props.sourceCode.instructions.length) {
            MachineActions.compile(lines);
        }
    }
}

EditorAssembler.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};
