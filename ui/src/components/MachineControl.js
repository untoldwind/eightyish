import React from 'react'

import Switch from './Switch'

import * as MachineActions from '../actions/MachineActions'

export default class MachineControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {toggle: false}
    }

    render() {
        const hasVideoLink = {
            value: this.props.hasVideo,
            requestChange: (value) => MachineActions.toggleVideo(value)
        }
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
                    {this.renderPlayStop()}
                </div>
                <div className="col-md-2">
                    <div className="well well-sm">Clock: {this.props.totalCycles}</div>
                </div>
            </div>
        )
    }

    renderPlayStop() {
        if (this.props.running) {
            return (
                <button className="btn btn-danger" onClick={MachineActions.stop}>
                    <span className="glyphicon glyphicon-stop"/>
                </button>
            )
        }
        return (
            <button className="btn btn-success" onClick={MachineActions.start}>
                <span className="glyphicon glyphicon-play"/>
            </button>
        )
    }
}

MachineControl.propTypes = {
    hasVideo: React.PropTypes.bool.isRequired,
    running: React.PropTypes.bool.isRequired,
    totalCycles: React.PropTypes.number.isRequired
}
