    mov     r0,1
    mov     r1,2
    mov     r2,3
    mov     r3,4
    mov     r4,5
    mov     r5,6
    mov     r6,7
    mov     r7,8
    mov     r8,9
    mov     r9,10
    mov     r10,11
    mov     r11,12
    mov     r12,13 ; this is a comment ~!@@!#^$'.,x.a " "
    nop;this is a comment ~!@@!#^$'.,x.a " "
    mov     r13,14
    mov     r14,0x8000
    cmp     r0,1
    ud.nz
    cmp     r1,2
    ud.nz
    cmp     r2,3
    ud.nz
    cmp     r3,4
    ud.nz
    cmp     r4,5
    ud.nz
    cmp     r5,6
    ud.nz
    cmp     r6,7
    ud.nz
    cmp     r7,8
    ud.nz
    cmp     r8,9
    ud.nz
    cmp     r9,10
    ud.nz
    cmp     r10,11
    ud.nz
    cmp     r11,12
    ud.nz
    cmp     r12,13
    ud.nz
    cmp     r13,14
    ud.nz
    cmp     r14,0x8000
    ud.nz

    mov     r1,2
    mov     r2,1
    shl     r2,2
    shl     r2,r1
    cmp     r2,16
    ud.nz
    shr     r2,2
    shr     r2,r1
    cmp     r2,1
    ud.nz   
    
    mov     r1,0xABCDEF12
    st32    0x7000,r1
    ld32    r2,0x7000
    cmp     r2,0xABCDEF12
    ud.nz
    st16    0x6900,r1
    ld16    r2,0x6900
    cmp     r2,0x0000EF12
    ud.nz
    st8     0x6800,r1
    ld8     r2,0x6800
    cmp     r2,0x00000012
    ud.nz
    
    push    r1
    pop     r2
    cmp     r2,0xABCDEF12
    ud.nz
    
    call    f
    cmp     r3,0x12345678
    ud.nz
    
    mov     r1,10
    cmp     r1,11
    ud.z
    ud.a
    ud.ae
    mov.be  r2,0xFFFFFFFF
    cmp     r2,0xFFFFFFFF
    ud.nz
    cmp     r1,9
    ud.z
    ud.bl
    ud.be
    mov.ae  r2,0xFFFFFFFF
    cmp     r2,0xFFFFFFFF
    ud.nz
    cmp     r1,10
    ud.bl
    jmp.ae g
    ud
g:  jmp.be  gg
    ud
gg: mov     r1,0xFFFFFFFF
    not     r1
    cmp     r1,0
    ud.nz
    and     r1,0x12345678
    cmp     r1,0
    ud.nz
    or      r1,0x12345678
    cmp     r1,0x12345678
    ud.nz
    xor     r1,0x12345678
    cmp     r1,0
    ud.nz
    xor     r1,0x12345678
    cmp     r1,0x12345678
    ud.nz
    
    mov     r2,0xF2000000
    mov     r1,0x40
    add     r1,r2
    cmp     r1,0xF2000040
    ud.nz
    sub     r1,0xF2000000
    cmp     r1,0x40
    ud.nz
    mov     r2,6
    mov     r1,4
    mul     r1,r2
    cmp     r1,24
    ud.nz
    div     r1,r2
    cmp     r1,4
    ud.nz
    
    break
    
f:  nop
    mov     r3,0x12345678
    ret
