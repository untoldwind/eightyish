import React from 'react';

export default class EditorMemory extends React.Component {
    render() {
        return (
        <pre style={{minHeight: '30em', border: 'none'}}
             dangerouslySetInnerHTML={{__html: this.props.sourceCode.memoryDump}}>
            </pre>
        );
    }
}

EditorMemory.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};
