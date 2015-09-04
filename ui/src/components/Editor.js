import React from 'react'

import EditorMemory from './EditorMemory'
import EditorAssembler from './EditorAssembler'

export default class Editor extends React.Component {
    static propTypes = {
        firmware: React.PropTypes.bool.isRequired,
        pc: React.PropTypes.number.isRequired,
        sourceCode: React.PropTypes.object.isRequired
    }

    render() {
        return (
            <div className="editor">
                <div className="col-md-4">
                    <EditorMemory pc={this.props.pc} sourceCode={this.props.sourceCode}/>
                </div>
                <div className="col-md-8">
                    <EditorAssembler firmware={this.props.firmware} sourceCode={this.props.sourceCode}/>
                </div>
            </div>
        )
    }
}
