import React from 'react'
import MenuItem from './MenuItem'

export default class MenuBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Eighty-ish</a>
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <MenuItem text="Simulator" to="simulator"/>
                            <MenuItem text="Instruction set" to="instructionSet"/>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
