import React from 'react';

export default class VideoDisplay extends React.Component {
    componentDidMount() {
        this.updateCanvas()
    }

    componentDidUpdate() {
        this.updateCanvas()
    }

    updateCanvas() {
        let canvas = React.findDOMNode(this.refs.canvas);
        let ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.props.scale * this.props.width, this.props.scale * this.props.height);
        ctx.fillStyle = 'black';

        let bitOffset = 0;
        for(let y = 0; y < this.props.height; y++ ) {
            for (let x = 0; x < this.props.width; x++ ) {
                let offset = bitOffset >> 3;
                if (((this.props.memory[offset] << (bitOffset & 0x7)) & 0x80) != 0) {
                    ctx.fillRect(x * this.props.scale, y * this.props.scale, this.props.scale, this.props.scale)
                }
                bitOffset++;
            }
        }
    }

    render() {
        return (
            <canvas height={this.props.scale * this.props.height}
                    ref="canvas"
                    width={this.props.scale * this.props.width}/>
        )
    }
}

VideoDisplay.propTypes = {
    memory: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number.isRequired
};