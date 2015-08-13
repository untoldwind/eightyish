import React from 'react';

import * as MachineActions from '../actions/MachineActions';

export default class MachineControl extends React.Component {
    render() {
        return (
            <div className="row">
                <button className="btn btn-danger" onClick={this.reset.bind(this)}>Reset</button>
            </div>
        );
    }

    reset() {
        MachineActions.reset();
    }
}