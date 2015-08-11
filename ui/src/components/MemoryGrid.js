import React from 'react';

import MemoryRow from './MemoryRow';

import * as formats from './formats';

export default class MemoryGrid extends React.Component {
    render() {
        return (
            <table className="table table-condensed table-bordered">
                <thead>
                <tr>
                    <th></th>
                    {Array.from(new Array(this.props.columns).keys()).map(i =>
                        <th key={i}>{formats.byte2hex(i)}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {Array.from(new Array(this.props.memory.length / this.props.columns).keys()).map(i =>
                        <MemoryRow columns={this.props.columns} key={i} memory={this.props.memory}
                                   offset={i * this.props.columns} registers={this.props.registers}/>
                )}
                </tbody>
            </table>
        );
    }
}

MemoryGrid.propTypes = {
    columns: React.PropTypes.number.isRequired,
    memory: React.PropTypes.array.isRequired,
    registers: React.PropTypes.object.isRequired
};
