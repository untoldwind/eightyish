import React from 'react'
import { Overlay } from 'react-overlays'

import EditableCell from './EditableCell'
import shallowEqual from '../util/shallowEqual'

import * as formats from '../util/formats'

export default class MemoryCell extends EditableCell {
    static propTypes = {
        address: React.PropTypes.number.isRequired,
        className: React.PropTypes.string,
        id: React.PropTypes.string,
        onChange: React.PropTypes.func,
        value: React.PropTypes.number.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            editing: false,
            showTooltip: false
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    startEditing() {
        this.setState({editing: true, text: formats.byte2hex(this.props.value)})
    }

    cancelTimeout() {
        if (this._timeout) {
            window.clearTimeout(this._timeout)
            this._timeout = null
        }
    }

    handleMouseEnter() {
        this.cancelTimeout()
        this._timeout = window.setTimeout(() => {
            this.setState({showTooltip: true})
        }, 1000)
    }

    handleMouseLeave() {
        this.cancelTimeout()
        this.setState({showTooltip: false})
    }

    render() {
        if (!this.state.editing) {
            return (
                <td className={this.props.className}
                    id={this.props.id}
                    onClick={this.startEditing.bind(this)}
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}>
                    <div>
                        {formats.byte2hex(this.props.value)}
                        {this.renderOverlay()}
                    </div>
                </td>
            )
        }
        return (
            <td className={this.props.className}
                id={this.props.id}
                onClick={this.startEditing.bind(this)}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}>
                <input className="form-control input-xs"
                       defaultValue={this.state.text}
                       onBlur={this.finishEditing.bind(this)}
                       onChange={this.textChanged.bind(this)}
                       onKeyDown={this.keyDown.bind(this)}
                       onReturn={this.finishEditing.bind(this)}
                       ref="input"
                       size={2}/>
            </td>
        )
    }

    renderOverlay() {
        if (!this.state.showTooltip) {
            return null
        }
        const nameStyle = {textAlign: "right", paddingRight: "5px"}
        const valueStyle = {textAlign: "left"}
        return (
            <Overlay placement="top" show={true}
                     target={props => React.findDOMNode(this)}>
                <div className="tooltip top fade in">
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-inner">
                        <table>
                            <tr>
                                <td style={nameStyle}>Address:</td>
                                <td style={valueStyle}>0x{formats.word2hex(this.props.address)}</td>
                            </tr>
                            <tr>
                                <td style={nameStyle}>Dec:</td>
                                <td style={valueStyle}>{this.props.value}</td>
                            </tr>
                            <tr>
                                <td style={nameStyle}>Hex:</td>
                                <td style={valueStyle}>0x{formats.byte2hex(this.props.value)}</td>
                            </tr>
                            <tr>
                                <td style={nameStyle}>Bin:</td>
                                <td style={valueStyle}>0b{formats.byte2bin(this.props.value)}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </Overlay>
        )
    }
}
