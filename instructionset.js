function InstructionSet()
{
    this.instructions = [
        {"mnemonic":"ud",  "opcode": 0x00, "handler": null, "doc": "ud\tInvalid opcode"},
        {"mnemonic":"add", "opcode": 0x10, "handler": null, "doc": "add reg1,reg2/imm32\tAdds reg2 to reg1 and stores result in reg1"},
        {"mnemonic":"sub", "opcode": 0x11, "handler": null, "doc": "sub reg1,reg2/imm32\tSubstracts reg2 from reg1 and stores result in reg1"},
        {"mnemonic":"mul", "opcode": 0x12, "handler": null, "doc": "mul reg1,reg2/imm32\tMultiplies reg1 by reg2 and stores result in reg1"},
        {"mnemonic":"div", "opcode": 0x13, "handler": null, "doc": "div reg1,reg2/imm32\tDivides reg1 by reg2 and stores result in reg1"},
        {"mnemonic":"jmp", "opcode": 0x14, "handler": null, "doc": "jmp location\tJumps to location"},
        {"mnemonic":"cli", "opcode": 0x15, "handler": null, "doc": "cli\tClear interrupts flag"},
        {"mnemonic":"sti", "opcode": 0x16, "handler": null, "doc": "sti\tSet interrupts flag"},
        {"mnemonic":"break", "opcode": 0x17, "handler": null, "doc": "break\tGenerates breakpoint exception"},
        {"mnemonic":"cmp", "opcode": 0x18, "handler": null, "doc": "cmp reg1,reg2/imm32\tSubtract reg2 from reg1 and modifies C and Z. Does not store result"},
        {"mnemonic":"nop", "opcode": 0x19, "handler": null, "doc": "nop\tNo operation"},
        {"mnemonic":"shl", "opcode": 0x1A, "handler": null, "doc": "shl reg1,reg2/imm32\tShift left reg1 bi reg2 bits"},
        {"mnemonic":"shr", "opcode": 0x1B, "handler": null, "doc": "shr reg1,reg2/imm32\tShift right reg1 bi reg2 bits"},
        {"mnemonic":"mov", "opcode": 0x1C, "handler": null, "doc": "mov reg1,reg2/imm32\tmov reg2 to reg1"},
        {"mnemonic":"and", "opcode": 0x1D, "handler": null, "doc": "and reg1,reg2/imm32\treg1 = reg1 AND reg2"},
        {"mnemonic":"or", "opcode": 0x1E, "handler": null, "doc":  "or reg1,reg2/imm32\treg1 = reg1 OR reg2"},
        {"mnemonic":"not", "opcode": 0x1F, "handler": null, "doc": "not reg1\treg1 = 1's complement of reg1"},
        {"mnemonic":"xor", "opcode": 0x20, "handler": null, "doc": "xor reg1,reg2/imm32\treg1 = reg1 XOR reg2"},
        {"mnemonic":"push", "opcode": 0x21, "handler": null, "doc": "push reg1/imm32\tr14-=8;[r14]=reg1"},
        {"mnemonic":"pop", "opcode": 0x22, "handler": null, "doc": "pop reg1\treg1=[r14];r14+=8"},
        {"mnemonic":"ld32", "opcode": 0x23, "handler": null, "doc": "ld32 reg1,location\tload 32bit word from location into reg1"},
        {"mnemonic":"st32", "opcode": 0x24, "handler": null, "doc": "st32 location,reg1\tstore 32bit word from reg1 to location"},
        {"mnemonic":"ld16", "opcode": 0x25, "handler": null, "doc": "ld16 reg1,location\tload 16bit word from location into reg1"},
        {"mnemonic":"st16", "opcode": 0x26, "handler": null, "doc": "st16 location,reg1\tstore 16bit word from reg1 to location"},
        {"mnemonic":"ld8", "opcode": 0x27, "handler": null, "doc": "ld8 reg1,location\tload 8bit word from location into reg1"},
        {"mnemonic":"st8", "opcode": 0x28, "handler": null, "doc": "st8 location,reg1\tstore 8bit word from reg1 to location"},
        {"mnemonic":"call", "opcode": 0x29, "handler": null, "doc": "call location\tpush r15+8 on the stack and jumps to location"},
        {"mnemonic":"ret", "opcode": 0x2A, "handler": null, "doc": "ret\tpop r15"},
        {"mnemonic":"reg", "opcode": 0x2B, "handler": null, "doc": "reg\treg reg1,reg2/imm32: set handler address stored in reg2 for exception defined by reg1"},
        {"mnemonic":"eret", "opcode": 0x2C, "handler": null, "doc": "eret\tclear e flag;pop r15"},
        {"mnemonic":"ireg", "opcode": 0x2D, "handler": null, "doc": "ireg\treg reg1,reg2/imm32: set handler address stored in reg2 for IRQ defined by reg1"},
        {"mnemonic":"iret", "opcode": 0x2E, "handler": null, "doc": "iret\tset general register bank, pop flags"},
        {"mnemonic":"mod", "opcode": 0x2F, "handler": null, "doc": "mod reg1,reg2/imm32\treg1 = reg1 MODULUS reg2"},
        {"mnemonic":"movsi", "opcode": 0x30, "handler": null, "doc": "movsi reg1,reg2/imm32\tmove value to register in the interupt bank"}
    ];

    this.conditions = [
        {"condition":"al", "code": 0x00, "handler":null, "doc": "Always"},
        {"condition":"z", "code": 0x01, "handler":null, "doc": "zero (or equal). Z=1"},
        {"condition":"nz", "code": 0x02, "handler":null, "doc": "Not zero (or not equal). Z=0"},
        {"condition":"ae", "code": 0x03, "handler":null, "doc": "Above or equal. C=1"},
        {"condition":"a", "code": 0x04, "handler":null, "doc": "Above. C=1 & Z=0"},
        {"condition":"be", "code": 0x05, "handler":null, "doc": "Below or equal. C=0 | Z=1"},
        {"condition":"bl", "code": 0x06, "handler":null, "doc": "Below. C=0"}
    ];


    this.instructionsByOpcode = [];
    for (var i=0;i<this.instructions.length;i++)
    {
        var ins = this.instructions[i];
        this.instructionsByOpcode[ins.opcode] = ins;
    }

    this.conditionsByOpcode = [];
    for (var i=0;i<this.conditions.length;i++)
    {
        var ins = this.conditions[i];
        this.conditionsByOpcode[ins.code] = ins;
    }

}

InstructionSet.prototype.getConditionByCode = function(val)
{
    return this.conditionsByOpcode[val];
}

InstructionSet.prototype.getConditionByMnemonic = function(val)
{
    var condition = this.conditions.filter(function(obj){
        if (obj.condition == val) return obj;
    })[0];

    return condition;
}

InstructionSet.prototype.getByOpcode = function(val)
{
    var instruction = this.instructionsByOpcode[val];
    if (instruction == null)
    {
        var h = this.getByOpcode(0);
        instruction = {"mnemonic":"???", opcode: 0xFF, handler: h, doc: ""};
    }

    return instruction;
}

InstructionSet.prototype.getByMnemonic = function(val)
{
    var instruction = this.instructions.filter(function(obj){
        if (obj.mnemonic == val) return obj;
    })[0];

    if (instruction == null)
    {
        var h = this.getByOpcode(0);
        instruction = {"mnemonic":"???", opcode: 0xFF, handler: h, doc: ""};
    }
    return instruction;
}



