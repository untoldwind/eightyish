import React from 'react'

export default class MenuItem extends React.Component {
    static contextTypes = {
        router: React.PropTypes.func.isRequired
    }

    static propTypes = {
        to: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    render() {
        let className = ''
        if (this.context.router.isActive(this.props.to)) {
            className = 'active'
        }
        return (
            <li className={className}>
                <a href="#" onClick={this.handleClick}>
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
