export default `
.firmware:
# Sets a pixel at (B, C)
.setPixel:
  PUSH   AF
  PUSH   DE
  PUSH   HL
  CALL   .getPixel_address
  LOAD   A <- 1
  ROTRC  A
.setPixel_shiftx:
  ROTRC  A
  DEC    E
  JUMP   NS, .setPixel_shiftx
  OR     A <- (HL)
  LOAD   (HL) <- A
  POP    HL
  POP    DE
  POP    AF
  RET

# Clears a pixel at (B, C)
.clearPixel:
  PUSH   AF
  PUSH   DE
  PUSH   HL
  CALL   .getPixel_address
  LOAD   A <- 255
.clearPixel_shiftx:
  ROTRC  A
  DEC    E
  JUMP   NS, .clearPixel_shiftx
  AND    A <- (HL)
  LOAD   (HL) <- A
  POP    HL
  POP    DE
  POP    AF
  RET

# Set address for a pixel at (B, C)
# Memory address will be stored in HL
# Bit position will be stored in E
.getPixel_address:
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
  LOAD   E <- A
  RET
`.trim().split('\n')
