import React from 'react'

import MachineControl from './MachineControl'
import MemoryGrid from './MemoryGrid'
import RegistersView from './RegistersView'
import Editor from './Editor'
import VideoDisplay from './VideoDisplay'

import machineStore from '../stores/MachineStore'

function getCurrentState() {
    const machineState = machineStore.getState()
    return {
        totalCycles: machineState.totalCycles,
        running: machineState.running,
        registers: machineState.registers,
        memory: machineState.memory,
        hasVideo: machineState.hasVideo,
        videoOffset: machineState.videoOffset,
        videoWidth: machineState.videoWidth,
        videoHeight: machineState.videoHeight,
        videoMemory: machineState.videoMemory,
        sourceCode: machineState.sourceCode
    }
}

export default class MachineView extends React.Component {
    constructor(props) {
        super(props)
        this.state = getCurrentState()
    }

    componentDidMount() {
        this.listener = machineStore.addListener(this.onChange.bind(this))
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove()
        }
    }

    onChange() {
        this.setState(getCurrentState())
    }

    render() {
        return (
            <div className="container">
                <MachineControl hasVideo={this.state.hasVideo}
                                running={this.state.running}
                                totalCycles={this.state.totalCycles}/>

                <div className="row">
                    <div className="col-md-5">
                        <h4>Registers</h4>
                        <RegistersView registers={this.state.registers}/>
                    </div>
                    <div className="col-md-7">
                        <h4>Assember</h4>
                        <Editor pc={this.state.registers.PC}
                                sourceCode={this.state.sourceCode}/>
                    </div>
                </div>
                {this.renderMemory()}
            </div>
        )
    }

    renderMemory() {
        if (this.state.hasVideo) {
            return (
                <div className="row">
                    <div className="col-md-6">
                        <h4>Video</h4>
                        <VideoDisplay height={this.state.videoHeight}
                                      memoryBlock={this.state.videoMemory}
                                      scale={4}
                                      width={this.state.videoWidth}/>
                        <MemoryGrid columns={16}
                                    memoryBlock={this.state.videoMemory}
                                    registers={this.state.registers}/>
                    </div>
                    <div className="col-md-6">
                        <h4>Main memory</h4>
                        <MemoryGrid columns={16}
                                    memoryBlock={this.state.memory}
                                    registers={this.state.registers}/>
                    </div>
                </div>
            )
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4>Main memory</h4>
                    <MemoryGrid columns={32}
                                memoryBlock={this.state.memory}
                                registers={this.state.registers}
                                segmentOffset={0}/>
                </div>
            </div>
        )
    }
}
