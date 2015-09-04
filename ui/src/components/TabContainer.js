import React from 'react'

export default class TabContainer extends React.Component {
    static propTypes = {
        tabActive: React.PropTypes.number,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    }

    static defaultProps = {
        tabActive: 0
    }

    constructor(props) {
        super(props)

        this.state = {
            tabActive: props.tabActive
        }
    }

    render() {
        return (
            <div>
                {this.renderMenu()}
                {this.renderSelected()}
            </div>
        )
    }

    renderMenu() {
        const menuItems = this.getPanels().map((panel, index) => {
            const className = index === this.state.tabActive ? 'active' : ''
            return (
                <li className={className} key={`tab-${index}`}>
                    <a href="#" onClick={this.selectTab(index)}>
                        {panel.props.title}
                    </a>
                </li>
            )
        })
        return (
            <ul className="nav nav-tabs">
                {menuItems}
            </ul>
        )
    }

    renderSelected() {
        return this.props.children[this.state.tabActive]
    }

    getPanels() {
        return this.props.children
            .map((panel) => typeof panel === 'function' ? panel() : panel)
            .filter((panel) => panel)
    }

    selectTab(index) {
        return (event) => {
            event.preventDefault()
            this.setState({tabActive: index})
        }
    }
}
