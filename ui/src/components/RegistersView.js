import React from 'react';

import * as formats from './formats';

export default class RegistersView extends React.Component {
    render() {
        return (
            <table className="table table-condensed table-bordered">
                <thead>
                <tr>
                    <th></th>
                    <th>Decimal</th>
                    <th>Hex</th>
                    <th>Binary</th>
                </tr>
                </thead>
                <tbody>
                {this.renderByteRegister('A')}
                {this.renderByteRegister('B')}
                {this.renderByteRegister('C')}
                {this.renderByteRegister('D')}
                {this.renderByteRegister('E')}
                {this.renderWordRegister('HL', 'bg-success')}
                {this.renderWordRegister('IX', 'bg-info')}
                {this.renderWordRegister('IY', 'bg-warning')}
                {this.renderWordRegister('SP', 'bg-danger')}
                {this.renderWordRegister('PC', 'bg-primary')}
                </tbody>
            </table>
        );
    }

    renderByteRegister(register) {
        return (
            <tr>
                <td>{register}</td>
                <td>{this.props.registers[register]}</td>
                <td>0x{formats.byte2hex(this.props.registers[register])}</td>
                <td>0b{formats.byte2bin(this.props.registers[register])}</td>
            </tr>
        );
    }

    renderWordRegister(register, className) {
        return (
            <tr className={className}>
                <td>{register}</td>
                <td>{this.props.registers[register]}</td>
                <td colSpan='2'>0x{formats.word2hex(this.props.registers[register])}</td>
            </tr>
        );
    }
}

Registers.propTypes = {
    registers: React.PropTypes.object.isRequired
};