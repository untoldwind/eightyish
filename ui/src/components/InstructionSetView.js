import React from 'react'

import { INSTRUCTIONS_BY_NAME } from '../stores/z80/InstructionSet'

class InstructionGroup {
    constructor(entry) {
        this.name = entry[0]
        this.statements = entry[1].sort((i1, i2) => i1.example.localeCompare(i2.example))
        this.size = this.statements.length
        if (this.size > 24) {
            this.columns = 4
        } else if (this.size > 12) {
            this.columns = 2
        } else {
            this.columns = 1
        }
    }
}

const instructionGroups = [...INSTRUCTIONS_BY_NAME.entries()].map((entry) => new InstructionGroup(entry)).
    sort((g1, g2) => g2.size - g1.size)

export default class InstructionSetView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {instructionGroups.map((group) =>
                            <div className={`col-md-${group.columns * 3}`} key={group.name}>
                                <div className="panel panel-default">
                                    <div className="panel-heading">{group.name}</div>
                                    <div className="panel-body">
                                        {group.statements.map((instruction) =>
                                                <div className={`col-md-${12 / group.columns}`}
                                                     key={instruction.example}>
                                                    {instruction.example}
                                                    {this.renderCyclesLabel(instruction.cycles)}
                                                </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                    )}
                </div>
            </div>
        )
    }

    renderCyclesLabel(cycles) {
        let weight = 'success'

        if (cycles > 5) {
            weight = 'warning'
        }
        if (cycles > 15) {
            weight = 'danger'
        }
        return (
            <span className={`label label-${weight} pull-right`}>
                {cycles}
            </span>
        )
    }
}
