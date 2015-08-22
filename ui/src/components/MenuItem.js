import React from 'react'

export default class MenuItem extends React.Component {
    render() {
        let className = ''
        if (this.context.router.isActive(this.props.to)) {
            className = 'active'
        }
        return (
            <li className={className}>
                <a href="#" onClick={this.handleClick.bind(this)}>
                    {this.props.text}
                </a>
            </li>
        )
    }

    handleClick(event) {
        event.preventDefault()
        this.context.router.transitionTo(this.props.to)
    }
}

MenuItem.contextTypes = {
    router: React.PropTypes.func.isRequired
}

MenuItem.propTypes = {
    to: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
}
