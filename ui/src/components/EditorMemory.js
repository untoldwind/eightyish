import React from 'react'

import * as MachineActions from '../actions/MachineActions'

import * as formats from './../util/formats'

export default class EditorMemory extends React.Component {
    static propTypes = {
        pc: React.PropTypes.number.isRequired,
        sourceCode: React.PropTypes.object.isRequired
    }

    shouldComponentUpdate(nextProps) {
        return this.props.sourceCode !== nextProps.sourceCode || this.props.pc !== nextProps.pc
    }

    render() {
        return (
            <ul className="assembler"
                id="editor-memory">
                {this.props.sourceCode.memoryDump.map((line, index) => {
                    let className = 'memory-dump'

                    if (line.offset === this.props.pc) {
                        className += ' bg-primary'
                    }
                    let dump = line.dump.map(formats.byte2hex)

                    if(dump.length > 5) {
                        dump = dump.slice(0, 4).concat('...')
                    }
                    return (
                        <li className={className}
                            key={index}
                            onClick={this.toggleBreakpoint(line.offset)}>
                            {this.renderBreakpoint(line.breakpoint)}
                            {'\u0020' + formats.word2hex(line.offset)}: {dump.join(' ')}
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderBreakpoint(breakpoint) {
        if (breakpoint) {
            return <span>{'\u2B24'}</span>
        }
        return <span>{'\u0020'}</span>
    }

    toggleBreakpoint(address) {
        return () => MachineActions.toggleBreakpoint(address)
    }
}
