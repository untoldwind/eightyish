import React from 'react'

import EditableCell from './EditableCell'

import * as MachineActions from '../actions/MachineActions'

import * as formats from './../util/formats'

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
                <td>{formats.word2hex(this.props.offset)}</td>
                {mapCount(this.props.columns, i =>
                        <EditableCell activeClassName="form-control input-xs"
                                      className={this.mark(this.props.offset + i)}
                                      key={i}
                                      onChange={this.changeMemory(i).bind(this)}
                                      value={formats.byte2hex(this.props.memoryBlock.getByte(i + this.props.offset))}/>
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
            return 'bg-primary'
        } else if (address === this.props.registers.SP) {
            return 'bg-danger'
        } else if (address === this.props.registers.HL) {
            return 'bg-success'
        } else if (address === this.props.registers.IX) {
            return 'bg-info'
        } else if (address === this.props.registers.IY) {
            return 'bg-warning'
        }
        return ''
    }
}
