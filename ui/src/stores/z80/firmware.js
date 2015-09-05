export default `
.firmware:
.setPixel:
  PUSH   AF
  PUSH   DE
  PUSH   HL
  LOAD   H <- 0
  LOAD   L <- C
  LOAD   E <- 4
.setPixel_muly:
  SHL    L
  ROTLC  H
  DEC    E
  JUMP   NZ, .setPixel_muly
  LOAD   D <- 0
  LOAD   E <- B
  SHR    E
  SHR    E
  SHR    E
  ADD    HL <- DE
  LOAD   DE <- 0x1000
  ADD    HL <- DE
  LOAD   A <- B
  AND    A <- 7
  ADD    A <- 1
  LOAD   E <- A
  LOAD   A <- 1
  ROTRC  A
.setPixel_shiftx:
  ROTRC  A
  DEC    E
  JUMP   NZ, .setPixel_shiftx
  OR     A <- (HL)
  LOAD   (HL) <- A
  POP    HL
  POP    DE
  POP    AF
  RET
`.split('\n')
