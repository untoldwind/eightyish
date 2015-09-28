import React from 'react'

import EditableCell from './EditableCell'
import MemoryCell from './MemoryCell'

import * as MachineActions from '../actions/MachineActions'

import * as formats from '../util/formats'

function mapCount(count, callback) {
    const result = []
    for (let i = 0; i < count; i++) {
        result.push(callback(i))
    }
    return result
}

export default class MemoryRow extends React.Component {
    static propTypes = {
        offset: React.PropTypes.number.isRequired,
        columns: React.PropTypes.number.isRequired,
        memoryBlock: React.PropTypes.object.isRequired,
        registers: React.PropTypes.object.isRequired
    }

    render() {
        return (
            <tr>
                <td><b>{formats.word2hex(this.props.offset)}</b></td>
                {mapCount(this.props.columns, i =>
                        <MemoryCell address={this.props.offset + i}
                                    className={this.mark(this.props.offset + i)}
                                    key={i}
                                    onChange={this.changeMemory(i)}
                                    value={this.props.memoryBlock.getByte(i + this.props.offset)}/>
                )}
            </tr>
        )
    }

    changeMemory(i) {
        return (str) => {
            const newValue = parseInt(str, 16)
            if (typeof newValue === 'number' && newValue >= 0 && newValue <= 255) {
                MachineActions.transition({}, this.props.offset + i, [newValue])
            }
        }
    }

    mark(address) {
        if (address === this.props.registers.PC) {
            return 'bg-primary hex-value'
        } else if (address === this.props.registers.SP) {
            return 'bg-danger hex-value'
        } else if (address === this.props.registers.HL) {
            return 'bg-success hex-value'
        } else if (address === this.props.registers.IX) {
            return 'bg-info hex-value'
        } else if (address === this.props.registers.IY) {
            return 'bg-warning hex-value'
        }
        return 'hex-value'
    }
}
