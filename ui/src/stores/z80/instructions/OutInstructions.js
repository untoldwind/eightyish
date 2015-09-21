import GenericInstruction from './GenericInstruction'
import Transition from '../Transition'

import { BYTE_VAL, OUT, POINTER_DELIM, REG_A } from './constants'

function operation(storer, first, second) {
    return new Transition().withChannelOut(first, second)
}

export const instructions = [
    new GenericInstruction(0xd3, 11, OUT, [BYTE_VAL, REG_A], operation, POINTER_DELIM)
]
