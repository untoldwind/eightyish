import React from 'react';

import EditableCell from './EditableCell';

import * as MachineActions from '../actions/MachineActions';

import * as formats from './formats';

export default class MemoryRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{formats.word2hex(this.props.segmentOffset + this.props.offset)}</td>
                {Array.from(new Array(this.props.columns).keys()).map(i =>
                        <EditableCell activeClassName="form-control input-sm"
                                      className={this.mark(this.props.segmentOffset + this.props.offset + i)}
                                      key={i}
                                      valueLink={this.memoryValueLink(i)}/>
                )}
            </tr>
        );
    }

    memoryValueLink(i) {
        return {
            value: formats.byte2hex(this.props.memory[i + this.props.offset]),
            requestChange: str => {
                const newValue = parseInt(str, 16);
                if (typeof newValue === 'number' && newValue >= 0 && newValue <= 255) {
                    MachineActions.transition({}, this.props.segmentOffset + this.props.offset + i, [newValue]);
                }
            }
        };
    }

    mark(address) {
        if (address === this.props.registers.PC) {
            return 'bg-primary';
        } else if (address === this.props.registers.SP) {
            return 'bg-danger';
        } else if (address === this.props.registers.HL) {
            return 'bg-success';
        } else if (address === this.props.registers.IX) {
            return 'bg-info';
        } else if (address === this.props.registers.IY) {
            return 'bg-warning';
        }
        return '';
    }
}

MemoryRow.propTypes = {
    segmentOffset: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number.isRequired,
    columns: React.PropTypes.number.isRequired,
    memory: React.PropTypes.array.isRequired,
    registers: React.PropTypes.object.isRequired
};
