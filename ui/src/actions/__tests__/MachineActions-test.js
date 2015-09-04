jest.dontMock('../MachineActions')
jest.dontMock('../../stores/z80/Transition')

import * as AppConstants from '../../dispatcher/AppConstants'

describe('Machine actions', () => {
    it('should dispatch message on toggleVideo', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.toggleVideo(true)
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_TOGGLE_VIDEO,
            videoEnabled: true
        })
    })

    it('should dispatch message on transition', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')
        const Transition = require('../../stores/z80/Transition')

        MachineActions.transition({PC: 1234}, 2345, [0xab, 0xcd])
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_TRANSITION,
            transition: new Transition({PC: 1234}, 2345, [0xab, 0xcd])
        })
    })

    it('should dispatch message on moveToSBegin', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.moveToSBegin()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_MOVE_TO_BEGIN
        })
    })

    it('should dispatch message on start', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.start()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_START
        })
    })

    it('should dispatch message on stop', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.stop()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_STOP
        })
    })

    it('should dispatch message on stepBackward', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.stepBackward()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_STEP_BACKWARD
        })
    })

    it('should dispatch message on stepForward', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.stepForward()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_STEP_FORWARD
        })
    })

    it('should dispatch message on fastFormward', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.fastForward()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_FAST_FORWARD
        })
    })

    it('should dispatch message on reset', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.reset()
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_RESET
        })
    })

    it('should dispatch message on compile', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.compile(['Line1', 'Line2'])
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_COMPILE,
            lines: ['Line1', 'Line2']
        })
    })

    it('should dispatch message on compileFirmware', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.compileFirmware(['Line1', 'Line2'])
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.MACHINE_COMPILE_FIRMWARE,
            lines: ['Line1', 'Line2']
        })
    })

    it('should dispatch message on toggleBreakpoint', () => {
        const appDispatcher = require('../../dispatcher/AppDispatcher')
        const MachineActions = require('../MachineActions')

        MachineActions.toggleBreakpoint(0x1234)
        expect(appDispatcher.dispatch).toBeCalledWith({
            type: AppConstants.TOGGLE_BREAKPOINT,
            address: 0x1234
        })
    })
})
