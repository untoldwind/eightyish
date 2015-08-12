import appDispatcher from '../dispatcher/AppDispatcher';

import * as AppConstants from '../dispatcher/AppConstants';

export function transition(newRegisters) {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_TRANSITION,
        newRegisters: newRegisters
    });
}

export function reset() {
    appDispatcher.dispatch({
        type: AppConstants.MACHINE_RESET
    });
}