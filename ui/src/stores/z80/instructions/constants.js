import RegisterArgument from '../arguments/RegisterArgument'
import RegisterPointerArgument from '../arguments/RegisterPointerArgument'
import IndexRegisterPointerArgument from '../arguments/IndexRegisterPointerArgument'
import BytePointerArgument from '../arguments/BytePointerArgument'
import ByteValueArgument from '../arguments/ByteValueArgument'
import ConditionArgument from '../arguments/ConditionArgument'
import WordPointerArgument from '../arguments/WordPointerArgument'
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
export const ADDC = 'ADDC'
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
export const OUT = 'OUT'
export const POP = 'POP'
export const PUSH = 'PUSH'
export const RET = 'RET'
export const ROTRC = 'ROTRC'
export const ROTLC = 'ROTLC'
export const SHL = 'SHL'
export const SHR = 'SHR'
export const SUB = 'SUB'
export const SUBC = 'SUBC'
export const XOR = 'XOR'

export const BYTE_VAL = ByteValueArgument
export const BYTE_POINTER = BytePointerArgument
export const WORD_VAL = WordValueArgument
export const WORD_POINTER = WordPointerArgument
export const REG_A = RegisterArgument('A')
export const REG_B = RegisterArgument('B')
export const REG_C = RegisterArgument('C')
export const REG_D = RegisterArgument('D')
export const REG_E = RegisterArgument('E')
export const REG_H = RegisterArgument('H')
export const REG_L = RegisterArgument('L')
export const REG_SP = RegisterArgument(SP)
export const REG_BC = RegisterArgument(BC)
export const REG_DE = RegisterArgument(DE)
export const REG_HL = RegisterArgument(HL)
export const REG_IX = RegisterArgument(IX)
export const REG_IY = RegisterArgument(IY)
export const POINTER_HL = RegisterPointerArgument(HL)
export const POINTER_IX = IndexRegisterPointerArgument(IX)
export const POINTER_IY = IndexRegisterPointerArgument(IY)
export const COND_Z = ConditionArgument('Z', true)
export const COND_NZ = ConditionArgument('Z', false)
export const COND_C = ConditionArgument('C', true)
export const COND_NC = ConditionArgument('C', false)
export const COND_S = ConditionArgument('S', true)
export const COND_NS = ConditionArgument('S', false)
export const COND_P = ConditionArgument('P', true)
export const COND_NP = ConditionArgument('P', false)
