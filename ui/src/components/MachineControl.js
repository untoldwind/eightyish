import React from 'react';

import Switch from './Switch';

import * as MachineActions from '../actions/MachineActions';

export default class MachineControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {toggle: false};
    }

    render() {
        const hasVideoLink = {
            value: this.props.hasVideo,
            requestChange: (value) => MachineActions.toggleVideo(value)
        };
        return (
            <div className="row">
                <div className="col-md-2">
                    <button className="btn btn-danger" onClick={MachineActions.reset}>Reset</button>
                </div>
                <div className="col-md-2">
                    <Switch label="Video" valueLink={hasVideoLink}/>
                </div>
                <div className="col-md-3 btn-group">
                    <button className="btn btn-danger" onClick={MachineActions.moveToSBegin}>
                        <span className="glyphicon glyphicon-fast-backward"/>
                    </button>
                    <button className="btn btn-warning" onClick={MachineActions.stepBackward}>
                        <span className="glyphicon glyphicon-step-backward"/>
                    </button>
                    <button className="btn btn-warning" onClick={MachineActions.stepForward}>
                        <span className="glyphicon glyphicon-step-forward"/>
                    </button>
                    <button className="btn btn-success" onClick={MachineActions.run}>
                        <span className="glyphicon glyphicon-play"/>
                    </button>
                </div>
            </div>
        );
    }
}

MachineControl.propTypes = {
    hasVideo: React.PropTypes.bool.isRequired
};
