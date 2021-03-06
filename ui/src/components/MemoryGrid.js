import React from 'react'

import MemoryRow from './MemoryRow'

import * as formats from './../util/formats'

import shallowEqual from '../util/shallowEqual'

export default class MemoryGrid extends React.Component {
    static propTypes = {
        columns: React.PropTypes.number.isRequired,
        id: React.PropTypes.string,
        memoryBlock: React.PropTypes.object.isRequired,
        registers: React.PropTypes.object.isRequired
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props, nextProps)
    }

    render() {
        return (
            <table className="table table-condensed table-bordered" id={this.props.id}>
                <thead>
                <tr>
                    <td>Address</td>
                    {Array.from(new Array(this.props.columns).keys()).map(i =>
                            <td key={i}><b>{formats.byte2hex(i)}</b></td>
                    )}
                </tr>
                </thead>
                <tbody>
                {Array.from(new Array(this.props.memoryBlock.data.length / this.props.columns).keys()).map(i =>
                        <MemoryRow columns={this.props.columns}
                                   key={i}
                                   memoryBlock={this.props.memoryBlock}
                                   offset={i * this.props.columns + this.props.memoryBlock.offset}
                                   registers={this.props.registers}/>
                )}
                </tbody>
            </table>
        )
    }
}
