import React from 'react'

import { INSTRUCTIONS_BY_NAME } from '../z80/InstructionSet'

const sortedByName = [...INSTRUCTIONS_BY_NAME.entries()].sort().map((entry) =>
    [entry[0], entry[1].map((instruction) => instruction.example).sort()])

export default class InstructionSetView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container-fluid">
                {sortedByName.map((entry) =>
                        <div className="col-md-3" key={entry[0]}>
                            <div className="panel panel-default">
                                <div className="panel-heading">{entry[0]}</div>
                                <div className="panel-body">
                                    <ul className="list-group">
                                        {entry[1].sort().map((example) =>
                                                <li className="list-group-item"
                                                    key={example}>{example}</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                )}
            </div>
        )
    }
}
