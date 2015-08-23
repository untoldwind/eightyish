import GenericInstruction from './GenericInstruction'

import { createFromRegisterInstructions2 } from './factory'

import { ByteValueArgument } from './Arguments'

import { REG_A, REG_BC, REG_DE, REG_HL, REG_IX, REG_IY, REG_SP,
    POINTER_HL, POINTER_IX, POINTER_IY, POINTER_DELIM, ADD} from './constants'

function byteOperation(storer, first, second) {
    const result = first + second

    return storer(result).withFlags(result)
}

function wordOperation(storer, first, second) {
    const result = first + second

    return storer(result)
}

export default [
    new GenericInstruction(0x09, ADD, [REG_HL, REG_BC], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x19, ADD, [REG_HL, REG_DE], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x29, ADD, [REG_HL, REG_HL], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x39, ADD, [REG_HL, REG_SP], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd09, ADD, [REG_IX, REG_BC], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd19, ADD, [REG_IX, REG_DE], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd29, ADD, [REG_IX, REG_IX], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xdd39, ADD, [REG_IX, REG_SP], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd09, ADD, [REG_IY, REG_BC], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd19, ADD, [REG_IY, REG_DE], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd29, ADD, [REG_IY, REG_IX], wordOperation, POINTER_DELIM),
    new GenericInstruction(0xfd39, ADD, [REG_IY, REG_SP], wordOperation, POINTER_DELIM),
    new GenericInstruction(0x86, ADD, [REG_A, POINTER_HL], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xdd86, ADD, [REG_A, POINTER_IX], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xfd86, ADD, [REG_A, POINTER_IY], byteOperation, POINTER_DELIM),
    new GenericInstruction(0xc6, ADD, [REG_A, ByteValueArgument], byteOperation, POINTER_DELIM)
].concat(createFromRegisterInstructions2(0x80, (opcode, register) =>
        new GenericInstruction(opcode, ADD, [REG_A, register], byteOperation, POINTER_DELIM)))
