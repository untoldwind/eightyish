export default `
.firmware:
# Prints A to the typewriter
.printChar:
  OUT    0 <- A
  RET

# Prints string (HL) to typewriter
# String are terminated by 0x00
.printString:
  LOAD   A <- (HL)
  INC    HL
  COMP   A, 0
  RET    Z
  OUT    0 <- A
  JUMP   .printString

# Multiply: HL = A * BC
.multiply:
  LOAD   HL <- 0x0
.multiply_loop:
  SHR    A
  JUMP   NC, .multiply_skip
  ADD    HL <- BC
.multiply_skip:
  RET    Z
  SHL    C
  ROTLC  B
  JUMP   .multiply_loop

# Fill memory with A
# Start address: HL
# Count: DE
.fillMemory:
  LOAD   (HL) <- A
  INC    HL
  DEC    E
  JUMP   NZ, .fillMemory
  DEC    D
  JUMP   NZ, .fillMemory
  RET

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
.getPixel_address_muly:
  SHL    L
  ROTLC  H
  DEC    E
  JUMP   NZ, .getPixel_address_muly
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

# Print char A (ascii)
# Column: B
# Row: C
.drawChar:
  PUSH   AF
  PUSH   BC
  PUSH   DE
  PUSH   HL
  PUSH   IX
  LOAD   D <- 0
  SUB    A <- 32
  LOAD   E <- A
  SHL    E
  ROTLC  D
  SHL    E
  ROTLC  D
  SHL    E
  ROTLC  D
  LOAD   IX <- .basic_font
  ADD    IX <- DE
  LOAD   H <- C
  LOAD   L <- 0
  SHR    H
  ROTRC  L
  LOAD   E <- B
  LOAD   D <- 0
  ADD    HL <- DE
  LOAD   DE <- 0x1000
  ADD    HL <- DE
  LOAD   B <- 8
  LOAD   DE <- 0x10
.drawChar_loop:
  LOAD   A <- (IX+0)
  LOAD   (HL) <- A
  INC    IX
  ADD    HL <- DE
  DEC    B
  JUMP   NZ, .drawChar_loop

  POP    IX
  POP    HL
  POP    DE
  POP    BC
  POP    AF
  RET

.basic_font:
= 0x00 00 00 00 00 00 00 00
= 0x18 18 18 18 18 00 18 00
= 0x6c 6c 00 00 00 00 00 00
= 0x6c 6c fe 6c fe 6c 6c 00
= 0x30 7c c0 78 0c f8 30 00
= 0x00 c6 cc 18 30 66 c6 00
= 0x38 6c 38 76 dc cc 76 00
= 0x60 60 c0 00 00 00 00 00
= 0x18 30 60 60 60 30 18 00
= 0x60 30 18 18 18 30 60 00
= 0x00 66 3c ff 3c 66 00 00
= 0x00 30 30 fc 30 30 00 00
= 0x00 00 00 00 00 30 30 60
= 0x00 00 00 fc 00 00 00 00
= 0x00 00 00 00 00 30 30 00
= 0x06 0c 18 30 60 c0 80 00
= 0x7c c6 ce de f6 e6 7c 00
= 0x30 70 30 30 30 30 fc 00
= 0x78 cc 0c 38 60 cc fc 00
= 0x78 cc 0c 38 0c cc 78 00
= 0x1c 3c 6c cc fe 0c 1e 00
= 0xfc c0 f8 0c 0c cc 78 00
= 0x38 60 c0 f8 cc cc 78 00
= 0xfc cc 0c 18 30 30 30 00
= 0x78 cc cc 78 cc cc 78 00
= 0x78 cc cc 7c 0c 18 70 00
= 0x00 30 30 00 00 30 30 00
= 0x00 30 30 00 00 30 30 60
= 0x18 30 60 c0 60 30 18 00
= 0x00 00 fc 00 00 fc 00 00
= 0x60 30 18 0c 18 30 60 00
= 0x78 cc 0c 18 30 00 30 00
= 0x7c c6 de de de c0 78 00
= 0x30 78 cc cc fc cc cc 00
= 0xfc 66 66 7c 66 66 fc 00
= 0x3c 66 c0 c0 c0 66 3c 00
= 0xf8 6c 66 66 66 6c f8 00
= 0xfe 62 68 78 68 62 fe 00
= 0xfe 62 68 78 68 60 f0 00
= 0x3c 66 c0 c0 ce 66 3e 00
= 0xcc cc cc fc cc cc cc 00
= 0x78 30 30 30 30 30 78 00
= 0x1e 0c 0c 0c cc cc 78 00
= 0xe6 66 6c 78 6c 66 e6 00
= 0xf0 60 60 60 62 66 fe 00
= 0xc6 ee fe fe d6 c6 c6 00
= 0xc6 e6 f6 de ce c6 c6 00
= 0x38 6c c6 c6 c6 6c 38 00
= 0xfc 66 66 7c 60 60 f0 00
= 0x78 cc cc cc dc 78 1c 00
= 0xfc 66 66 7c 6c 66 e6 00
= 0x78 cc e0 70 1c cc 78 00
= 0xfc b4 30 30 30 30 78 00
= 0xcc cc cc cc cc cc fc 00
= 0xcc cc cc cc cc 78 30 00
= 0xc6 c6 c6 d6 fe ee c6 00
= 0xc6 c6 6c 38 38 6c c6 00
= 0xcc cc cc 78 30 30 78 00
= 0xfe c6 8c 18 32 66 fe 00
= 0x78 60 60 60 60 60 78 00
= 0xc0 60 30 18 0c 06 02 00
= 0x78 18 18 18 18 18 78 00
= 0x10 38 6c c6 00 00 00 00
= 0x00 00 00 00 00 00 00 ff
= 0x30 30 18 00 00 00 00 00
= 0x00 00 78 0c 7c cc 76 00
= 0xe0 60 60 7c 66 66 dc 00
= 0x00 00 78 cc c0 cc 78 00
= 0x1c 0c 0c 7c cc cc 76 00
= 0x00 00 78 cc fc c0 78 00
= 0x38 6c 60 f0 60 60 f0 00
= 0x00 00 76 cc cc 7c 0c f8
= 0xe0 60 6c 76 66 66 e6 00
= 0x30 00 70 30 30 30 78 00
= 0x0c 00 0c 0c 0c cc cc 78
= 0xe0 60 66 6c 78 6c e6 00
= 0x70 30 30 30 30 30 78 00
= 0x00 00 cc fe fe d6 c6 00
= 0x00 00 f8 cc cc cc cc 00
= 0x00 00 78 cc cc cc 78 00
= 0x00 00 dc 66 66 7c 60 f0
= 0x00 00 76 cc cc 7c 0c 1e
= 0x00 00 dc 76 66 60 f0 00
= 0x00 00 7c c0 78 0c f8 00
= 0x10 30 7c 30 30 34 18 00
= 0x00 00 cc cc cc cc 76 00
= 0x00 00 cc cc cc 78 30 00
= 0x00 00 c6 d6 fe fe 6c 00
= 0x00 00 c6 6c 38 6c c6 00
= 0x00 00 cc cc cc 7c 0c f8
= 0x00 00 fc 98 30 64 fc 00
= 0x1c 30 30 e0 30 30 1c 00
= 0x18 18 18 00 18 18 18 00
= 0xe0 30 30 1c 30 30 e0 00
= 0x76 dc 00 00 00 00 00 00
= 0x00 00 00 00 00 00 00 00
`.trim().split('\n')
