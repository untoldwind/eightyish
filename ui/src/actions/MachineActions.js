import appDispatcher from '../dispatcher/AppDispatcher'

import * as AppConstants from '../dispatcher/AppConstants'

import Transition from '../stores/z80/Transition'

export function toggleVideo(videoEnabled) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TOGGLE_VIDEO,
        videoEnabled: videoEnabled
    })
}

export function toggleTypewriter(typewriterEnabled) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TOGGLE_TYPEWRITER,
        typewriterEnabled: typewriterEnabled
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

export function start() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_START
    })
}

export function stop() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_STOP
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

export function fastForward() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_FAST_FORWARD
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

export function compileFirmware(lines) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_COMPILE_FIRMWARE,
        lines: lines
    })
}

export function toggleBreakpoint(address) {
    appDispatcher.dispatch({
        type: AppConstants.TOGGLE_BREAKPOINT,
        address: address
    })
}
