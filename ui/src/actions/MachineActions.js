import appDispatcher from '../dispatcher/AppDispatcher';

import * as AppConstants from '../dispatcher/AppConstants';

import Transition from '../z80/Transition';

export function toggleVideo(videoEnabled) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TOGGLE_VIDEO,
        videoEnabled: videoEnabled
    });
}
export function transition(newRegisters, memoryOffset, newMemoryData) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TRANSITION,
        transition: new Transition(newRegisters, memoryOffset, newMemoryData)
    });
}

export function reset() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_RESET
    });
}

export function compile(lines) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_COMPILE,
        lines: lines
    });
}