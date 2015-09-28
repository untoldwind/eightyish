import React from 'react'

export default class TabPanel extends React.Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    }

    render() {
        return <div>{this.props.children}</div>
    }
}
