import React from 'react'

import Switch from './Switch'

import * as MachineActions from '../actions/MachineActions'

export default class MachineControl extends React.Component {
    static propTypes = {
        hasVideo: React.PropTypes.bool.isRequired,
        hasTypewriter: React.PropTypes.bool.isRequired,
        running: React.PropTypes.bool.isRequired,
        totalCycles: React.PropTypes.number.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {toggle: false}
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-2">
                    <button className="btn btn-danger" id="btn-reset" onClick={MachineActions.reset}>Reset</button>
                </div>
                <div className="col-md-2">
                    <Switch id="switch-typewriter" label="Printer" value={this.props.hasTypewriter}
                            onChange={MachineActions.toggleTypewriter}/>
                </div>
                <div className="col-md-2">
                    <Switch id="switch-video" label="Video" value={this.props.hasVideo}
                            onChange={MachineActions.toggleVideo}/>
                </div>
                <div className="col-md-4 btn-toolbar">
                    <div className="btn-group">
                        <button className="btn btn-danger" onClick={MachineActions.moveToSBegin}>
                            <span className="glyphicon glyphicon-fast-backward"/>
                        </button>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-warning" onClick={MachineActions.stepBackward}>
                            <span className="glyphicon glyphicon-step-backward"/>
                        </button>
                        <button className="btn btn-warning" onClick={MachineActions.stepForward}>
                            <span className="glyphicon glyphicon-step-forward"/>
                        </button>
                    </div>
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
                <div className="btn-group">
                    <button className="btn btn-danger" onClick={MachineActions.stop}>
                        <span className="glyphicon glyphicon-stop"/>
                    </button>
                </div>
            )
        }
        return (
            <div className="btn-group">
            <button className="btn btn-success" onClick={MachineActions.start}>
                <span className="glyphicon glyphicon-play"/>
            </button>
                <button className="btn btn-success" onClick={MachineActions.fastForward}>
                    <span className="glyphicon glyphicon-forward"/>
                </button>
            </div>
        )
    }
}
