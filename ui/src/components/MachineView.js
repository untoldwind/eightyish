import React from 'react'
import FluxContainer from 'flux/lib/FluxContainer'

import MachineControl from './MachineControl'
import MemoryGrid from './MemoryGrid'
import RegistersView from './RegistersView'
import Editor from './Editor'
import TypewriterDisplay from './TypewriterDisplay'
import VideoDisplay from './VideoDisplay'
import TabContainer from './TabContainer'
import TabPanel from './TabPanel'

import machineStore from '../stores/MachineStore'

class MachineView extends React.Component {
    static getStores() {
        return [machineStore]
    }

    static calculateState() {
        return {
            machineState: machineStore.getState()
        }
    }

    render() {
        return (
            <div className="container">
                <MachineControl hasTypewriter={this.state.machineState.hasTypewriter}
                                hasVideo={this.state.machineState.hasVideo}
                                running={this.state.machineState.running}
                                totalCycles={this.state.machineState.totalCycles}/>

                <div className="row">
                    <div className="col-md-5">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#">Registers</a></li>
                        </ul>
                        <RegistersView registers={this.state.machineState.registers}/>
                    </div>
                    <div className="col-md-7">
                        <TabContainer>
                            <TabPanel title="Assember">
                                <Editor firmware={false}
                                        pc={this.state.machineState.registers.PC}
                                        sourceCode={this.state.machineState.sourceCode}/>
                            </TabPanel>
                            <TabPanel title="Firmware">
                                <Editor firmware={true}
                                        pc={this.state.machineState.registers.PC}
                                        sourceCode={this.state.machineState.firmwareSource}/>
                            </TabPanel>
                        </TabContainer>
                    </div>
                </div>
                {this.renderMemory()}
            </div>
        )
    }

    renderMemory() {
        if (this.state.machineState.hasVideo || this.state.machineState.hasTypewriter) {
            return (
                <div className="row">
                    <div className="col-md-6">
                        <TabContainer>
                            {this.renderVideoDisplay()}
                            {this.renderTypewriterDisplay()}
                        </TabContainer>
                    </div>
                    <div className="col-md-6">
                        <TabContainer>
                            <TabPanel title="Main memory">
                                <MemoryGrid columns={16}
                                            id="main-memory-grid"
                                            memoryBlock={this.state.machineState.memory}
                                            registers={this.state.machineState.registers}/>
                            </TabPanel>
                            {this.renderVideoMemory()}
                        </TabContainer>
                    </div>
                </div>
            )
        }
        return (
            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#">Main memory</a></li>
                    </ul>
                    <MemoryGrid columns={32}
                                id="main-memory-grid"
                                memoryBlock={this.state.machineState.memory}
                                registers={this.state.machineState.registers}/>
                </div>
            </div>
        )
    }

    renderVideoDisplay() {
        if (this.state.machineState.hasVideo) {
            return (
                <TabPanel title="Video display">
                    <VideoDisplay height={this.state.machineState.videoHeight}
                                  id="video-memory-display"
                                  memoryBlock={this.state.machineState.videoMemory}
                                  width={this.state.machineState.videoWidth}/>
                </TabPanel>
            )
        }
    }

    renderTypewriterDisplay() {
        if (this.state.machineState.hasTypewriter) {
            return (
                <TabPanel title="Typewriter">
                    <TypewriterDisplay id="typewriter-display"
                                       typewriter={this.state.machineState.channel0}/>
                </TabPanel>
            )
        }
    }

    renderVideoMemory() {
        if (this.state.machineState.hasVideo) {
            return (
                <TabPanel title="Video memory">
                    <MemoryGrid columns={16}
                                id="video-memory-grid"
                                memoryBlock={this.state.machineState.videoMemory}
                                registers={this.state.machineState.registers}/>
                </TabPanel>
            )
        }
    }
}

export default FluxContainer.create(MachineView)
