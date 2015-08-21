jest.dontMock('../MachineActions');
jest.dontMock('../../z80/Transition');

import * as AppConstants from '../../dispatcher/AppConstants';

describe('Machine actions', () => {
    it('should dispatch message on toggleVideo', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.toggleVideo(true);
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_TOGGLE_VIDEO,
            videoEnabled: true
        });
    });

    it('should dispatch message on transition', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');
        const Transition = require('../../z80/Transition');

        MachineActions.transition({PC: 1234}, 2345, [0xab, 0xcd]);
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_TRANSITION,
            transition: new Transition({PC: 1234}, 2345, [0xab, 0xcd])
        });
    });

    it('should dispatch message on moveToSBegin', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.moveToSBegin();
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_MOVE_TO_BEGIN
        });
    });

    it('should dispatch message on run', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.run();
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_RUN
        });
    });

    it('should dispatch message on stepBackward', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.stepBackward();
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_STEP_BACKWARD
        });
    });

    it('should dispatch message on stepForward', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.stepForward();
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_STEP_FORWARD
        });
    });

    it('should dispatch message on reset', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.reset();
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_RESET
        });
    });

    it('should dispatch message on compile', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher');
        const MachineActions = require('../MachineActions');

        MachineActions.compile(['Line1', 'Line2']);
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_COMPILE,
            lines: ['Line1', 'Line2']
        });
    });
});
