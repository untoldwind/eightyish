import React from 'react';

export default class EditorMemory extends React.Component {
    render() {
        return (
            <pre dangerouslySetInnerHTML={{__html: this.props.sourceCode.memoryDump}}
                 style={{minHeight: '30em', border: 'none'}}/>
        );
    }
}

EditorMemory.propTypes = {
    sourceCode: React.PropTypes.object.isRequired
};
