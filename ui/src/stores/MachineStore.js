import {ReduceStore} from 'flux/utils'

import appDispatcher from '../../dispatcher/AppDispatcher'

import MachineState from './z80/MachineState.js'

class MachineStore extends ReduceStore {
    constructor(dispatcher) {
        super(dispatcher)
    }

    getInitialState() {
        return new MachineState()
    }

    reduce(state, action) {
        console.log(action)
        return state
    }
}

export default new MachineStore(appDispatcher)
