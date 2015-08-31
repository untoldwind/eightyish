import React from 'react'

import * as MachineActions from '../actions/MachineActions'

import * as formats from './formats'

export default class EditorMemory extends React.Component {
    render() {
        return (
            <ul className="assembler">
                {this.props.sourceCode.memoryDump.map((line, index) => {
                    let className = 'memory-dump'

                    if (line.offset === this.props.pc) {
                        className += ' bg-primary'
                    }

                    return (
                        <li className={className}
                            key={index}
                            onClick={this.toggleBreakpoint(line.offset)}>
                            {this.renderBreakpoint(line.breakpoint)}
                            {'\u0020' + formats.word2hex(line.offset)}: {line.dump.map(formats.byte2hex).join(' ')}
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderBreakpoint(breakpoint) {
        if (breakpoint) {
            return <span className="glyphicon glyphicon-stop alert-danger"></span>
        }
        return <span className="glyphicon">{'\u0020'}</span>
    }

    toggleBreakpoint(address) {
        return () => MachineActions.toggleBreakpoint(address)
    }
}

EditorMemory.propTypes = {
    pc: React.PropTypes.number.isRequired,
    sourceCode: React.PropTypes.object.isRequired
}
