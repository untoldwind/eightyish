import React from 'react';

export default class EditorAssembler extends React.Component {
    render() {
        var data = '1\n2\n3\n4\n';
        return (
            <pre>{data}
            </pre>
        );
    }
}