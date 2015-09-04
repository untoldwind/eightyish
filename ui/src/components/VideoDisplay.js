import React from 'react'

import shallowEqual from '../util/shallowEqual'

export default class VideoDisplay extends React.Component {
    static propTypes = {
        id: React.PropTypes.string,
        memoryBlock: React.PropTypes.object.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            scale: 1.0
        }
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        this.updateScale()
        this.createBackingCanvas()
        this.updateCanvas()
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    componentDidUpdate(prevProps) {
        if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
            this.createBackingCanvas()
        }
        this.updateCanvas()
    }

    handleResize() {
        this.updateScale()
    }

    updateScale() {
        const parent = React.findDOMNode(this.refs.canvas).parentNode
        const scale = (parent.clientWidth - 30.0) / this.props.width

        if ( scale !== this.state.scale) {
            this.setState({
                scale: scale
            })
        }
    }

    createBackingCanvas() {
        this.backingCanvas = document.createElement('canvas')
        this.backingCanvas.setAttribute('width', this.props.width)
        this.backingCanvas.setAttribute('height', this.props.height)
        this.backingContext = this.backingCanvas.getContext('2d')
        this.backingImageData = this.backingContext.createImageData(this.props.width, this.props.height)
    }

    updateCanvas() {
        const data = this.props.memoryBlock.data
        const imageData = this.backingImageData.data
        let index = 0

        for (let i = 0; i < data.length; i++) {
            let byte = data[i]
            for (let j = 0; j < 8; j++) {
                if ((byte & 0x80) !== 0) {
                    imageData[index++] = 0
                    imageData[index++] = 0
                    imageData[index++] = 0
                    imageData[index++] = 255
                } else {
                    imageData[index++] = 255
                    imageData[index++] = 255
                    imageData[index++] = 255
                    imageData[index++] = 255
                }
                byte <<= 1
            }
        }
        this.backingContext.putImageData(this.backingImageData, 0, 0)

        const canvas = React.findDOMNode(this.refs.canvas)
        const ctx = canvas.getContext('2d')

        ctx.imageSmoothingEnabled = false
        ctx.mozImageSmoothingEnabled = false
        ctx.webkitImageSmoothingEnabled = false
        ctx.msImageSmoothingEnabled = false
        ctx.drawImage(this.backingCanvas, 0, 0, this.props.width, this.props.height,
            0, 0, this.state.scale * this.props.width, this.state.scale * this.props.height)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
    }

    render() {
        return (
            <canvas height={this.state.scale * this.props.height}
                    id={this.props.id}
                    ref="canvas"
                    width={this.state.scale * this.props.width}/>
        )
    }


}
