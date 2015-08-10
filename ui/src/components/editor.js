import React from 'react';

import EditorMemory from './editor_memory';
import EditorAssembler from './editor_assembler';

export default class Editor extends React.Component {
    render() {
        return (
            <div>
                <div className="col-md-4">
                    <EditorMemory/>
                </div>
                <div className="col-md-8">
                    <EditorAssembler/>
                </div>
            </div>
        );
    }
}

Editor.propTypes = {
    pc: React.PropTypes.number.isRequired,
    memory: React.PropTypes.array.isRequired
};
