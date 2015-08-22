import React from 'react'
import { Route, DefaultRoute, RouteHandler, run } from 'react-router'

import MenuBar from './components/MenuBar'
import MachineView from './components/MachineView'
import InstructionSetView from './components/InstructionSetView'

export default class App extends React.Component {
    render() {
        return (
            <div>
                <MenuBar/>

                <div className="container">
                    <RouteHandler />
                </div>
            </div>
        )
    }
}

const routes = (
    <Route handler={App}>
        <DefaultRoute handler={MachineView} name="simulator"/>
        <Route handler={InstructionSetView} name="instructionSet"/>
    </Route>
)

run(routes, (Handler) => React.render(<Handler/>, document.getElementById('app')))

