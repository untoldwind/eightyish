import React from 'react';

import EditorMemory from './EditorMemory';
import EditorAssembler from './EditorAssembler';

export default class Editor extends React.Component {
    render() {
        return (
            <div>
                <div className="col-md-4">
                    <EditorMemory/>
                </div>
                <div className="col-md-8">
                    <EditorAssembler sourceCode={this.props.sourceCode}/>
                </div>
            </div>
        );
    }
}

Editor.propTypes = {
    pc: React.PropTypes.number.isRequired,
    memory: React.PropTypes.array.isRequired,
    sourceCode: React.PropTypes.object.isRequired
};
