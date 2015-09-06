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
        this.updateCanvas()
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    componentDidUpdate() {
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

    updateCanvas() {
        const data = this.props.memoryBlock.data
        const canvas = React.findDOMNode(this.refs.canvas)
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, this.state.scale * this.props.width, this.state.scale * this.props.height)
        ctx.fillStyle = 'black'

        let x = 0
        let ix = 0
        let y = 0
        for (let i = 0; i < data.length; i++) {
            let byte = data[i]
            for(let j = 0; j < 8; j++) {
                if ((byte & 0x80) != 0 ) {
                    ctx.fillRect(x, y, this.state.scale, this.state.scale)
                }
                byte <<= 1
                x += this.state.scale
                ix ++
                if (ix >= this.props.width) {
                    ix = 0
                    x = 0
                    y += this.state.scale
                }
            }
        }
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
