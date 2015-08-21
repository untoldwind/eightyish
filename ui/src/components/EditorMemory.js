import React from 'react'

import * as formats from './formats'

export default class EditorMemory extends React.Component {
    render() {
        return (
            <ul className="assembler">
                {this.props.sourceCode.memoryDump.map((line, index) => {
                    const className = line.offset === this.props.pc ? 'bg-primary' : ''

                    return <li className={className} key={index}>{formats.word2hex(line.offset)}: {line.dump}</li>
                })}
            </ul>
        )
    }
}

EditorMemory.propTypes = {
    pc: React.PropTypes.number.isRequired,
    sourceCode: React.PropTypes.object.isRequired
}
