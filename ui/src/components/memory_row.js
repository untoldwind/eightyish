import React from 'react';

import * as formats from './formats';

export default class MemoryRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{formats.word2hex(this.props.offset)}</td>
                {Array.from(new Array(this.props.columns).keys()).map(i =>
                        <td key={i}>{formats.byte2hex(this.props.memory[i + this.props.offset])}</td>
                )}
            </tr>
        );
    }
}

MemoryRow.propTypes = {
    offset: React.PropTypes.number.isRequired,
    columns: React.PropTypes.number.isRequired,
    memory: React.PropTypes.array.isRequired
};
