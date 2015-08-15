import React from 'react';

export default class VideoDisplay extends React.Component {
    componentDidMount() {
        this.updateCanvas()
    }

    componentDidUpdate() {
        this.updateCanvas()
    }

    updateCanvas() {
        var canvas = React.findDOMNode(this.refs.canvas);
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.props.scale * this.props.width, this.props.scale * this.props.height);
        ctx.fillStyle = 'black';

        var bitOffset = 0;
        for(var y = 0; y < this.props.height; y++ ) {
            for (var x = 0; x < this.props.width; x++ ) {
                var offset = bitOffset >> 3;
                if (((this.props.memory[offset] << (bitOffset & 0x7)) & 0x80) != 0) {
                    ctx.fillRect(x * this.props.scale, y * this.props.scale, this.props.scale, this.props.scale)
                }
                bitOffset++;
            }
        }
    }

    render() {
        return (
            <canvas ref="canvas"
                    width={this.props.scale * this.props.width}
                    height={this.props.scale * this.props.height}/>
        )
    }
}

VideoDisplay.propTypes = {
    memory: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    scale: React.PropTypes.number.isRequired
};