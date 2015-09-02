import React from 'react'

import shallowEqual from '../util/shallowEqual'

export default class VideoDisplay extends React.Component {
    static propTypes = {
        memoryBlock: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        scale: React.PropTypes.number.isRequired
    }

    componentDidMount() {
        this.updateCanvas()
    }

    componentDidUpdate() {
        this.updateCanvas()
    }

    updateCanvas() {
        const canvas = React.findDOMNode(this.refs.canvas)
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, this.props.scale * this.props.width, this.props.scale * this.props.height)
        ctx.fillStyle = 'black'

        let bitOffset = 0
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                const offset = (bitOffset >> 3) + this.props.memoryBlock.offset
                if (((this.props.memoryBlock.getByte(offset) << (bitOffset & 0x7)) & 0x80) !== 0) {
                    ctx.fillRect(x * this.props.scale, y * this.props.scale, this.props.scale, this.props.scale)
                }
                bitOffset++
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        return !shallowEqual(this.props, nextProps)
    }

    render() {
        return (
            <canvas height={this.props.scale * this.props.height}
                    ref="canvas"
                    width={this.props.scale * this.props.width}/>
        )
    }
}
