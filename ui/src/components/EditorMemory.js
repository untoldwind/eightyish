import React from 'react';

export default class EditorMemory extends React.Component {
    render() {
        return (
            <ul className="assembler">
                {this.props.sourceCode.memoryDump.map((line, index) => <li key={index}>{line}</li>)}
            </ul>
        );
    }
}

EditorMemory.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};
