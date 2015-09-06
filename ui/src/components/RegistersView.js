import React from 'react'

import EditableCell from './EditableCell'

import * as MachineActions from '../actions/MachineActions'
import * as formats from './../util/formats'

export default class RegistersView extends React.Component {
    static propTypes = {
        registers: React.PropTypes.object.isRequired
    }

    render() {
        return (
            <table className="table table-condensed table-bordered">
                <thead>
                <tr>
                    <th colSpan="4">8-bit</th>
                    <th colSpan="3">16-bit</th>
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
                {this.renderByteRegisters('H', 'L', 'bg-success')}
                {this.renderWordRegister('IX', 'bg-info', 'Z', 'Zero')}
                {this.renderWordRegister('IY', 'bg-warning', 'S', 'Sign')}
                {this.renderWordRegister('SP', 'bg-danger', 'P', 'Parity')}
                {this.renderWordRegister('PC', 'bg-primary', 'C', 'Carry')}
                </tbody>
            </table>
        )
    }

    renderByteRegisters(highRegister, lowRegister, className) {
        const highSetter = formats.byteParser((value) =>
            MachineActions.transition({[highRegister]: value}))
        const lowSetter = formats.byteParser((value) =>
            MachineActions.transition({[lowRegister]: value}))
        const wordSetter = formats.wordParser((value) =>
            MachineActions.transition({[highRegister + lowRegister]: value}))

        return [
            <tr key="high">
                <td>{highRegister}</td>
                <EditableCell activeClassName="form-control input-sm"
                              id={`register-${highRegister}-dec`}
                              onChange={highSetter}
                              value={this.props.registers[highRegister]}/>
                <EditableCell activeClassName="form-control input-sm"
                              id={`register-${highRegister}-hex`}
                              onChange={highSetter}
                              value={`0x${formats.byte2hex(this.props.registers[highRegister])}`}/>
                <EditableCell activeClassName="form-control input-sm"
                              id={`register-${highRegister}-bin`}
                              onChange={highSetter}
                              value={`0b${formats.byte2bin(this.props.registers[highRegister])}`}/>
                <td className={className}
                    rowSpan="2" style={{verticalAlign: 'middle'}}>{highRegister + lowRegister}</td>
                <EditableCell activeClassName="form-control input-sm" className={className}
                              id={`register-${highRegister}${lowRegister}-dec`}
                              rowSpan={2} style={{verticalAlign: 'middle'}}
                              onChange={wordSetter}
                              value={this.props.registers[highRegister + lowRegister]}/>
                <EditableCell activeClassName="form-control input-sm" className={className}
                              id={`register-${highRegister}${lowRegister}-hex`}
                              rowSpan={2} style={{verticalAlign: 'middle'}}
                              onChange={wordSetter}
                              value={`0x${formats.word2hex(this.props.registers[highRegister + lowRegister])}`}/>
            </tr>,
            <tr key="low">
                <td>{lowRegister}</td>
                <EditableCell activeClassName="form-control input-sm"
                              id={`register-${lowRegister}-dec`}
                              onChange={lowSetter}
                              value={this.props.registers[lowRegister]}/>
                <EditableCell activeClassName="form-control input-sm"
                              id={`register-${lowRegister}-hex`}
                              onChange={lowSetter}
                              value={`0x${formats.byte2hex(this.props.registers[lowRegister])}`}/>
                <EditableCell activeClassName="form-control input-sm"
                              id={`register-${lowRegister}-bin`}
                              onChange={lowSetter}
                              value={`0b${formats.byte2bin(this.props.registers[lowRegister])}`}/>
            </tr>
        ]
    }

    renderWordRegister(register, className, flagName, flagDescription) {
        let flag
        if (flagName) {
            flag = (
                <td colSpan="4">
                <span className={this.props.registers[`flag${flagName}`] ? 'label label-success' : 'label label-default'}>
                    {flagDescription.substring(0, 1)}
                </span>
                    {flagDescription.substring(1)}
                </td>
            )
        } else {
            flag = <td colSpan="4">Flags</td>
        }

        const wordSetter = formats.wordParser((value) =>
            MachineActions.transition({[register]: value}))

        return (
            <tr>
                {flag}
                <td className={className}>{register}</td>
                <EditableCell activeClassName="form-control input-sm" className={className}
                              id={`register-${register}-dec`}
                              onChange={wordSetter}
                              value={this.props.registers[register]}/>
                <EditableCell activeClassName="form-control input-sm" className={className}
                              id={`register-${register}-hex`}
                              onChange={wordSetter}
                              value={`0x${formats.word2hex(this.props.registers[register])}`}/>
            </tr>
        )
    }
}
