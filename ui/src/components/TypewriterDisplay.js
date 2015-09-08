import React from 'react'

import shallowEqual from '../util/shallowEqual'

export default class TypewriterDisplay extends React.Component {
    static propTypes = {
        id: React.PropTypes.string,
        typewriter: React.PropTypes.object.isRequired
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
    }

    render() {
        const lines = this.props.typewriter.lines.map((line, index) => {
            return (
                <li key={index}>{line}</li>
            )
        })
        return (
            <ul className="typewriter" id={this.props.id}>
                {lines}
            </ul>
        )
    }
}
