import React from 'react';

import EditableCell from './EditableCell';

import * as MachineActions from '../actions/MachineActions';
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
                {this.renderWordRegister('IX', 'bg-info', 'flagZ', 'Zero')}
                {this.renderWordRegister('IY', 'bg-warning', 'flagS', 'Sign')}
                {this.renderWordRegister('SP', 'bg-danger', 'flagP', 'Parity')}
                {this.renderWordRegister('PC', 'bg-primary', 'flagC', 'Carry')}
                </tbody>
            </table>
        );
    }

    renderByteRegisters(highRegister, lowRegister) {
        let highValueLink = {
            value: this.props.registers[highRegister],
            requestChange: value => MachineActions.transition({[highRegister]: value})
        };
        let lowValueLink = {
            value: this.props.registers[lowRegister],
            requestChange: value => MachineActions.transition({[lowRegister]: value})
        };
        let valueLink = {
            value: this.props.registers[highRegister + lowRegister],
            requestChange: value => MachineActions.transition({[highRegister + lowRegister]: value})
        };
        return [
            <tr key='high'>
                <td>{highRegister}</td>
                <EditableCell activeClassName="form-control input-sm"
                              valueLink={formats.byteValueLink(10, highValueLink)}/>
                <EditableCell activeClassName="form-control input-sm"
                              valueLink={formats.byteValueLink(16, highValueLink)}/>
                <EditableCell activeClassName="form-control input-sm"
                              valueLink={formats.byteValueLink(2, highValueLink)}/>
                <td rowSpan='2' style={{verticalAlign: 'middle'}}>{highRegister + lowRegister}</td>
                <EditableCell activeClassName="form-control input-sm" rowSpan={2} style={{verticalAlign: 'middle'}}
                              valueLink={formats.wordValueLink(10, valueLink)}/>
                <EditableCell activeClassName="form-control input-sm" rowSpan={2} style={{verticalAlign: 'middle'}}
                              valueLink={formats.wordValueLink(16, valueLink)}/>
            </tr>,
            <tr key='low'>
                <td>{lowRegister}</td>
                <EditableCell activeClassName="form-control input-sm"
                              valueLink={formats.byteValueLink(10, lowValueLink)}/>
                <EditableCell activeClassName="form-control input-sm"
                              valueLink={formats.byteValueLink(16, lowValueLink)}/>
                <EditableCell activeClassName="form-control input-sm"
                              valueLink={formats.byteValueLink(2, lowValueLink)}/>
            </tr>
        ]
    }

    renderWordRegister(register, className, flagName, flagDescription) {
        let valueLink = {
            value: this.props.registers[register],
            requestChange: value => MachineActions.transition({[register]: value})
        };
        let flag;
        if (flagName) {
            flag = (
                <td colSpan='4'>
                <span className={this.props.registers[flagName] ? 'label label-success' : 'label label-default'}>
                    {flagDescription.substring(0, 1)}
                </span>
                    {flagDescription.substring(1)}
                </td>
            );
        } else {
            flag = <td colSpan='4'>Flags</td>;
        }
        return (
            <tr>
                {flag}
                <td className={className}>{register}</td>
                <EditableCell activeClassName="form-control input-sm" className={className}
                              valueLink={formats.wordValueLink(10, valueLink)}/>
                <EditableCell activeClassName="form-control input-sm" className={className}
                              valueLink={formats.wordValueLink(16, valueLink)}/>
            </tr>
        );
    }
}

RegistersView.propTypes = {
    registers: React.PropTypes.object.isRequired
};