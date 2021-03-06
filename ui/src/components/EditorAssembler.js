import React from 'react'

import * as MachineActions from '../actions/MachineActions'

function assemblerEquals(lines, instructions) {
    if (lines.length !== instructions.length) {
        return false
    }
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== instructions[i].assembler) {
            return false
        }
    }
    return true
}

export default class EditorAssembler extends React.Component {
    static propTypes = {
        firmware: React.PropTypes.bool.isRequired,
        sourceCode: React.PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)

        this.handleBlur = this.handleBlur.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
    }

    componentDidMount() {
        this.updateContent()
    }

    componentDidUpdate() {
        this.updateContent()
    }

    updateContent() {
        const selectedLine = this.getSelectedLine()
        React.findDOMNode(this).innerHTML = '<ul class="assembler">' +
            this.props.sourceCode.statements.map(instruction =>
                `<li class="${instruction.type}">${instruction.assembler}</li>`).join('') +
            '</ul>'
        this.setSelectedLine(selectedLine)
    }

    shouldComponentUpdate(nextProps) {
        return this.props.sourceCode !== nextProps.sourceCode
    }

    getSelectedLine() {
        if (!window.getSelection) {
            return -1
        }

        const selection = getSelection()

        if (selection.rangeCount <= 0) {
            return -1
        }

        const range = selection.getRangeAt(0)
        let selectedNode = range.startContainer

        if (selectedNode.nodeType !== Node.ELEMENT_NODE) {
            selectedNode = selectedNode.parentNode
        }

        const parent = React.findDOMNode(this).getElementsByTagName('UL')[0]

        if (selectedNode.parentNode !== parent) {
            return -1
        }

        let selectedLine = 0
        while ((selectedNode = selectedNode.previousSibling) !== null) {
            selectedLine++
        }
        return selectedLine
    }

    setSelectedLine(line) {
        if (line < 0) {
            return
        }
        if (window.getSelection && document.createRange) {
            const selection = getSelection()
            selection.removeAllRanges()
            const children = React.findDOMNode(this).getElementsByTagName('UL')[0].children
            if (line < children.length) {
                const range = document.createRange()
                range.setStart(children[line], 1)
                range.setEnd(children[line], 1)
                selection.addRange(range)
            }
        }
    }

    render() {
        return (
            <div className="assembler"
                 contentEditable="true"
                 id="editor-assembler"
                 onBlur={this.handleBlur}
                 onKeyUp={this.handleKeyUp}/>
        )
    }

    handleBlur() {
        this.emitChange()
    }

    handleKeyUp(event) {
        const keyCode = event.keyCode
        if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
            this.emitChange()
        }
    }

    emitChange() {
        let lines = []
        const parent = React.findDOMNode(this)
        for (let child of parent.children) {
            if (child.nodeType === 1 && child.nodeName.toUpperCase() === 'UL') {
                for (let listItem of child.children) {
                    lines = lines.concat(listItem.textContent.split('\n'))
                }
            } else {
                parent.removeChild(child)
            }
        }

        if (!assemblerEquals(lines, this.props.sourceCode.statements)) {
            if (this.props.firmware) {
                MachineActions.compileFirmware(lines)
            } else {
                MachineActions.compile(lines)
            }
        }
    }
}
