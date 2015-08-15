import React from 'react';

import Switch from './Switch';

import * as MachineActions from '../actions/MachineActions';

export default class MachineControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {toggle: false};
    }

    render() {
        var hasVideoLink = {
            value: this.props.hasVideo,
            requestChange: (value) => MachineActions.toggleVideo(value)
        };
        return (
            <div className="row">
                <div className="col-md-2">
                    <button className="btn btn-danger" onClick={this.reset.bind(this)}>Reset</button>
                </div>
                <div className="col-md-2">
                    <Switch label='Video' valueLink={hasVideoLink}/>
                </div>
            </div>
        );
    }

    reset() {
        MachineActions.reset();
    }
}

MachineControl.propTypes = {
    hasVideo: React.PropTypes.bool.isRequired
};