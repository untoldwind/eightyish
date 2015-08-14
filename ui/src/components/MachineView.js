import React from 'react';

import MachineControl from './MachineControl';
import MemoryGrid from './MemoryGrid';
import RegistersView from './RegistersView';
import Editor from './Editor';

import machineState from '../z80/MachineState';

function getCurrentState() {
    return {
        registers: machineState.registers,
        memory: machineState.memory,
        videoOffset: machineState.videoOffset,
        video: machineState.video,
        sourceCode: machineState.sourceCode
    }
}

export default class MachineView extends React.Component {
    constructor(props) {
        super(props);
        this.state = getCurrentState();
    }

    componentDidMount() {
        machineState.addChangeListener(this.onChange.bind(this));
    }

    componentWillUnmount() {
        machineState.removeChangeListener(this.onChange.bind(this));
    }

    onChange() {
        this.setState(getCurrentState());
    }

    render() {
        return (
            <div className="container">
                <MachineControl/>
                <div className="row">
                    <div className="col-md-4">
                        <h4>Registers</h4>
                        <RegistersView registers={this.state.registers}/>
                    </div>
                    <div className="col-md-8">
                        <Editor memory={this.state.memory} sourceCode={this.state.sourceCode}
                                pc={this.state.registers.PC}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Main memory</h4>
                        <MemoryGrid segmentOffset={0} columns={32} memory={this.state.memory} registers={this.state.registers}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h4>Video memory</h4>
                        <MemoryGrid segmentOffset={this.state.videoOffset} columns={32} memory={this.state.video} registers={this.state.registers}/>
                    </div>
                </div>
            </div>
        );
    }
}