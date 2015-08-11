import React from 'react';

import * as formats from './formats';

export default class MemoryRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{formats.word2hex(this.props.offset)}</td>
                {Array.from(new Array(this.props.columns).keys()).map(i =>
                        <td className={this.mark(this.props.offset + i)} key={i}>
                            {formats.byte2hex(this.props.memory[i + this.props.offset])}
                        </td>
                )}
            </tr>
        );
    }

    mark(address) {
        if(address == this.props.registers.PC) {
            return 'bg-primary';
        } else if(address == this.props.registers.SP) {
            return 'bg-danger';
        } else if(address == this.props.registers.HL) {
            return 'bg-success';
        } else if(address == this.props.registers.IX) {
            return 'bg-info';
        } else if(address == this.props.registers.IY) {
            return 'bg-warning';
        }
        return '';
    }
}

MemoryRow.propTypes = {
    offset: React.PropTypes.number.isRequired,
    columns: React.PropTypes.number.isRequired,
    memory: React.PropTypes.array.isRequired,
    registers: React.PropTypes.object.isRequired
};
