import React from 'react';

import MemoryGrid from './memory_grid';
import Registers from './registers';

import State from '../z80/state';

export default class Machine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            machineState: new State(1024, 1024)
        };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <Registers registers={this.state.machineState.registers}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <MemoryGrid columns={32} memory={this.state.machineState.memory}/>
                    </div>
                </div>
            </div>
        );
    }
}