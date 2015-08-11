import React from 'react';

import MemoryGrid from './MemoryGrid';
import RegistersView from './RegistersView';
import Editor from './Editor';

import MachineState from '../z80/MachineState';

export default class MachineView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            machineState: new MachineState(1024, 1024)
        };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <RegistersView registers={this.state.machineState.registers}/>
                    </div>
                    <div className="col-md-8">
                        <Editor memory={this.state.machineState.memory} sourceCode={this.state.machineState.sourceCode} pc={this.state.machineState.registers.PC} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <MemoryGrid columns={32} memory={this.state.machineState.memory} registers={this.state.machineState.registers}/>
                    </div>
                </div>
            </div>
        );
    }
}