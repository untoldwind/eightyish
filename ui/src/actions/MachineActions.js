import appDispatcher from '../dispatcher/AppDispatcher'

import * as AppConstants from '../dispatcher/AppConstants'

import Transition from '../z80/Transition'

export function toggleVideo(videoEnabled) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TOGGLE_VIDEO,
        videoEnabled: videoEnabled
    })
}

export function transition(newRegisters, memoryOffset, newMemoryData) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TRANSITION,
        transition: new Transition(newRegisters, memoryOffset, newMemoryData)
    })
}

export function moveToSBegin() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_MOVE_TO_BEGIN
    })
}

export function run() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_RUN
    })
}

export function stepBackward() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_STEP_BACKWARD
    })
}

export function stepForward() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_STEP_FORWARD
    })
}

export function reset() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_RESET
    })
}

export function compile(lines) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_COMPILE,
        lines: lines
    })
}
