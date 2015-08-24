import RegisterArgument from '../arguments/RegisterArgument'
import RegisterPointerArgument from '../arguments/RegisterPointerArgument'
import IndexRegisterPointerArgument from '../arguments/IndexRegisterPointerArgument'
import ByteValueArgument from '../arguments/ByteValueArgument'
import WordValueArgument from '../arguments/WordValueArgument'

export const POINTER_DELIM = ' <- '

export const AF = 'AF'
export const BC = 'BC'
export const DE = 'DE'
export const HL = 'HL'
export const IX = 'IX'
export const IY = 'IY'
export const PC = 'PC'
export const SP = 'SP'

export const ADD = 'ADD'
export const AND = 'AND'
export const CALL = 'CALL'
export const COMP = 'COMP'
export const DEC = 'DEC'
export const HALT = 'HALT'
export const INC = 'INC'
export const JUMP = 'JUMP'
export const LOAD = 'LOAD'
export const NOP = 'NOP'
export const OR = 'OR'
export const POP = 'POP'
export const PUSH = 'PUSH'
export const RET = 'RET'
export const SHL = 'SHL'
export const SHR = 'SHR'
export const SUB = 'SUB'
export const XOR = 'XOR'

export const BYTE_VAL = ByteValueArgument
export const WORD_VAL = WordValueArgument
export const REG_A = RegisterArgument('A')
export const REG_SP = RegisterArgument(SP)
export const REG_BC = RegisterArgument(BC)
export const REG_DE = RegisterArgument(DE)
export const REG_HL = RegisterArgument(HL)
export const REG_IX = RegisterArgument(IX)
export const REG_IY = RegisterArgument(IY)
export const POINTER_HL = RegisterPointerArgument(HL)
export const POINTER_IX = IndexRegisterPointerArgument(IX)
export const POINTER_IY = IndexRegisterPointerArgument(IY)
