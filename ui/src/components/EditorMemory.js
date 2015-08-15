import React from 'react';

export default class EditorMemory extends React.Component {
    render() {
        var data = '1\n2\n3\n4\n';
        return (
            <pre style={{minHeight: '30em', border: 'none'}}>{data}
            </pre>
        );
    }
}