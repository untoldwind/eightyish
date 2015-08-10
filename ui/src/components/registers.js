import React from 'react';

import * as formats from './formats';

export default class Registers extends React.Component {
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
                {this.renderWordRegister('HL')}
                {this.renderWordRegister('IX')}
                {this.renderWordRegister('IY')}
                {this.renderWordRegister('SP')}
                {this.renderWordRegister('PC')}
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

    renderWordRegister(register) {
        return (
            <tr>
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