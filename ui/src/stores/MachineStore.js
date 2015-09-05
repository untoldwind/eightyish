import ReduceStore from 'flux/lib/FluxReduceStore'

import * as AppConstants from '../dispatcher/AppConstants'

import appDispatcher from '../dispatcher/AppDispatcher'

import * as MachineActions from '../actions/MachineActions'

import MachineState from './z80/MachineState.js'

class MachineStore extends ReduceStore {
    constructor(dispatcher) {
        super(dispatcher)
    }

    getInitialState() {
        return MachineState.create(1024, 128, 64).restore()
    }

    reduce(state, action) {
        switch (action.type) {
        case AppConstants.MACHINE_RESET:
            return state.reset()

        case AppConstants.MACHINE_START:
        {
            clearTimeout(this.timer)
            const nextState = state.start()
            if (nextState.running) {
                this.timer = setTimeout(MachineActions.stepForward, 5)
            }
            return nextState
        }

        case AppConstants.MACHINE_STOP:
            clearTimeout(this.timer)
            return state.stop()

        case AppConstants.MACHINE_MOVE_TO_BEGIN:
            return state.moveToBegin()

        case AppConstants.MACHINE_STEP_FORWARD:
        {
            const nextState = state.stepForward()
            if (nextState.running) {
                this.timer = setTimeout(MachineActions.stepForward, 5)
            }
            return nextState
        }

        case AppConstants.MACHINE_FAST_FORWARD:
            return state.fastForward()

        case AppConstants.MACHINE_STEP_BACKWARD:
            return state.stepBackward()

        case AppConstants.MACHINE_TRANSITION:
            return action.transition.perform(state)

        case AppConstants.MACHINE_TOGGLE_VIDEO:
            return state.toggleVideo(action.videoEnabled)

        case AppConstants.MACHINE_COMPILE:
            return state.compile(action.lines)

        case AppConstants.MACHINE_COMPILE_FIRMWARE:
            return state.compileFirmware(action.lines)

        case AppConstants.TOGGLE_BREAKPOINT:
            return state.toggleBreakpoint(action.address)

        default:
            return state
        }
    }
}

export default new MachineStore(appDispatcher)
