import React from 'react'

import { INSTRUCTIONS_BY_NAME } from '../stores/z80/InstructionSet'

class InstructionGroup {
    constructor(name, statements) {
        this.name = name
        this.size = statements.length
        if (this.size > 24) {
            this.depth = 0
            this.columns = [[], [], [], []]
        } else if (this.size > 12) {
            this.depth = 1
            this.columns = [[], []]
        } else {
            this.depth = 3
            this.columns = [[]]
        }
        statements.sort((i1, i2) => i1.example.localeCompare(i2.example)).forEach((statement, index) => {
            const column = Math.floor(index * this.columns.length / this.size)
            this.columns[column].push(statement)
        })
    }

    render() {
        return (
            <div className="panel panel-default" key={this.name}>
                <div className="panel-heading">{this.name}</div>
                <div className="panel-body">
                    {this.columns.map((column, index) =>
                            <div className={`col-md-${12 / this.columns.length}`}
                                 key={index}>
                                {column.map((statement) =>
                                    <div key={statement.example}>
                                        {statement.example}
                                        {this.renderCyclesLabel(statement.cycles)}
                                    </div>
                                )}
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

class InstructionColumnNode {
    constructor(depth = 0, parent = null) {
        this.depth = depth
        this.parent = parent
        this.elements = []
        this.elementsSize = 0
        if (depth < 2) {
            this.left = new InstructionColumnNode(depth + 1, this)
            this.right = new InstructionColumnNode(depth + 1, this)
        }
    }

    findLowest(depth) {
        if (this.depth >= 2 || depth === this.depth) {
            return this
        }
        const leftLowest = this.left.findLowest(depth)
        const rightLowest = this.right.findLowest(depth)

        return leftLowest.relativeSize() <= rightLowest.relativeSize() ? leftLowest : rightLowest
    }

    relativeSize() {
        if (this.parent !== null) {
            return this.parent.relativeSize() + this.elementsSize
        }
        return this.elementsSize
    }

    addGroup(group) {
        const node = this.findLowest(group.depth)

        node.elements.push(group)
        node.elementsSize += group.size
    }

    render() {
        return (
            <div>
                {this.elements.map((element) => element.render())}
                <div style={{width: '50%', float: 'left', paddingRight: '5px'}}>
                    {this.depth < 2 ? this.left.render() : null}
                </div>
                <div style={{width: '50%', float: 'left', paddingLeft: '5px'}}>
                    {this.depth < 2 ? this.right.render() : null}
                </div>
            </div>
        )
    }
}

const instructionTree = new InstructionColumnNode()

for (let name of [...INSTRUCTIONS_BY_NAME.keys()].sort()) {
    instructionTree.addGroup(new InstructionGroup(name, INSTRUCTIONS_BY_NAME.get(name)))
}

export default class InstructionSetView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {instructionTree.render()}
                </div>
            </div>
        )
    }
}
