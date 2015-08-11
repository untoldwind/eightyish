import React from 'react';

import EditableCell from './EditableCell';

import * as formats from './formats';

export default class RegistersView extends React.Component {
    render() {
        return (
            <table className="table table-condensed table-bordered">
                <thead>
                <tr>
                    <th colSpan='4'>8-bit</th>
                    <th colSpan='3'>16-bit</th>
                </tr>
                <tr>
                    <th></th>
                    <th>Dec</th>
                    <th>Hex</th>
                    <th>Bin</th>
                    <th></th>
                    <th>Dec</th>
                    <th>Hex</th>
                </tr>
                </thead>
                <tbody>
                {this.renderByteRegisters('A', 'F')}
                {this.renderByteRegisters('B', 'C')}
                {this.renderByteRegisters('D', 'E')}
                {this.renderWordRegister('HL', 'bg-success')}
                {this.renderWordRegister('IX', 'bg-info')}
                {this.renderWordRegister('IY', 'bg-warning')}
                {this.renderWordRegister('SP', 'bg-danger')}
                {this.renderWordRegister('PC', 'bg-primary')}
                </tbody>
            </table>
        );
    }

    renderByteRegisters(highRegister, lowRegister) {
        var highValueLink = {
            value: this.props.registers[highRegister],
            requestChange: v => console.log(v)
        };
        return [
            <tr key='high'>
                <td>{highRegister}</td>
                <td><EditableCell valueLink={highValueLink}/></td>
                <td>0x{formats.byte2hex(this.props.registers[highRegister])}</td>
                <td>0b{formats.byte2bin(this.props.registers[highRegister])}</td>
                <td rowSpan='2' style={{verticalAlign: 'middle'}}>{highRegister + lowRegister}</td>
                <td rowSpan='2'
                    style={{verticalAlign: 'middle'}}>{this.props.registers[highRegister + lowRegister]}</td>
                <td rowSpan='2' style={{verticalAlign: 'middle'}}>
                    0x{formats.word2hex(this.props.registers[highRegister + lowRegister])}</td>
            </tr>,
            <tr key='low'>
                <td>{lowRegister}</td>
                <td>{this.props.registers[lowRegister]}</td>
                <td>0x{formats.byte2hex(this.props.registers[lowRegister])}</td>
                <td>0b{formats.byte2bin(this.props.registers[lowRegister])}</td>
            </tr>
        ]
    }

    renderWordRegister(register, className) {
        return (
            <tr>
                <td colSpan='4'></td>
                <td className={className}>{register}</td>
                <td className={className}>{this.props.registers[register]}</td>
                <td className={className} colSpan='2'>0x{formats.word2hex(this.props.registers[register])}</td>
            </tr>
        );
    }
}

RegistersView.propTypes = {
    registers: React.PropTypes.object.isRequired
};