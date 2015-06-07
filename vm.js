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



var Bank = {"GenericBank":0, "InteruptBank":1};


function SoC()
{
    var soc = this;
    this.reset();
    this.instructionset = new InstructionSet();
    this.memory = new Memory(1*1024*1024);
    this.keyboard = null;

    // 16 exception handlers;
    this.exceptionHandlers = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
    this.irqHandlers = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];

    this.instructionset.getConditionByMnemonic("al").handler = function(){return true;};
    this.instructionset.getConditionByMnemonic("z").handler = function(){return ((soc.flags&1) == 1);};
    this.instructionset.getConditionByMnemonic("nz").handler = function(){return ((soc.flags&1) == 0);};
    this.instructionset.getConditionByMnemonic("ae").handler = function(){return ((soc.flags&2) == 0);};
    this.instructionset.getConditionByMnemonic("a").handler = function(){return ((soc.flags&3) == 0);};
    this.instructionset.getConditionByMnemonic("be").handler = function(){return ((soc.flags&3) != 0);};
    this.instructionset.getConditionByMnemonic("bl").handler = function(){return ((soc.flags&2) == 1);};

    this.instructionset.getByMnemonic("ud").handler = function(op1,op2,number)
    {
        soc.triggerException(1);
    }
    this.instructionset.getByMnemonic("nop").handler = function(op1,op2,number)
    {
        // do nothing
    }
    this.instructionset.getByMnemonic("push").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            soc.push(soc.reg()[op1]);
        }
        else
        {
            soc.push(number);
        }
    }
    this.instructionset.getByMnemonic("pop").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            soc.reg()[op1] = soc.pop();
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("shl").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15) 
            {
                soc.reg()[op1] =  soc.reg()[op1] << soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] =  soc.reg()[op1] << number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("shr").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1] =  soc.reg()[op1] >>> soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] =  soc.reg()[op1] >>> number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("mov").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1] =  soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] =  number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("movsi").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.registerBanks[Bank.InteruptBank][op1] =  soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.registerBanks[Bank.InteruptBank][op1] =  number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }

    this.instructionset.getByMnemonic("and").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1] =  (soc.reg()[op1] & soc.reg()[op2]);
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] =  (soc.reg()[op1] & number);
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("or").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1] =  (soc.reg()[op1] | soc.reg()[op2]);
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] =  (soc.reg()[op1] |  number);
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("xor").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1] =  (soc.reg()[op1] ^ soc.reg()[op2]);
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] =  (soc.reg()[op1]  ^ number);
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("not").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            soc.reg()[op1] =  ~(soc.reg()[op1]);
        }
        else
        {
            soc.triggerException(2);
        }
    }


    this.instructionset.getByMnemonic("cmp").handler = function(op1,op2,number)
    {
        var o1;
        var o2;
        if (op1<=15)
        {
            if (op2<=15)
            {
                o1 = soc.reg()[op1];
                o2 = soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                o1 = soc.reg()[op1];
                o2 = number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }

        if (o1==o2)
        {
            soc.flags &= ~3;
            soc.flags |= 1;
        }
        else if (o2>o1)
        {
            soc.flags |= 2;
            soc.flags &= ~1;
        }
        else
        {
            soc.flags &= ~3;
        }
    }

    this.instructionset.getByMnemonic("add").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1]+=soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.reg()[op1]+=number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("mod").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1] = (soc.reg()[op1] % soc.reg()[op2])>>>0;
            }
            else if (op2 == 31)
            {
                soc.reg()[op1] = (soc.reg()[op1] % number)>>>0;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }

    this.instructionset.getByMnemonic("sub").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1]-=soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.reg()[op1]-=number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }

    this.instructionset.getByMnemonic("mul").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                soc.reg()[op1]*=soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                soc.reg()[op1]*=number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }

    this.instructionset.getByMnemonic("div").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            if (op2<=15)
            {
                if (soc.reg()[op2] == 0)
                {
                    soc.triggerException(3);
                }
                soc.reg()[op1]/=soc.reg()[op2];
            }
            else if (op2 == 31)
            {
                if (number == 0)
                {
                    soc.triggerException(3);
                }
                soc.reg()[op1]/=number;
            }
            else
            {
                soc.triggerException(2);
            }
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("ld32").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            var addr;
            if (op2==31)
            {
                addr = number;
            }
            else if (op2<=15)
            {
                addr = soc.reg()[op2];
            }
            else
            {
                soc.triggerException(2);
            }

            soc.reg()[op1]=soc.memory.getWordAtByteIndex(addr);
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("st32").handler = function(op1,op2,number)
    {
        if (op2<=15)
        {
            var addr;
            if (op1==31)
            {
                addr = number;
            }
            else if (op1<=15)
            {
                addr = soc.reg()[op1];
            }
            else
            {
                soc.triggerException(2);
            }
            soc.memory.setWordAtByteIndex(addr,soc.reg()[op2]);
        }
        else
        {
            soc.triggerException(2);
        }
    }   
    this.instructionset.getByMnemonic("ld16").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            var addr;
            if (op2==31)
            {
                addr = number;
            }
            else if (op2<=15)
            {
                addr = soc.reg()[op2];
            }
            else
            {
                soc.triggerException(2);
            }
            soc.reg()[op1]=soc.memory.getWord16AtByteIndex(addr);
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("st16").handler = function(op1,op2,number)
    {
        if (op2<=15)
        {
            var addr;
            if (op1==31)
            {
                addr = number;
            }
            else if (op1<=15)
            {
                addr = soc.reg()[op1];
            }
            else
            {
                soc.triggerException(2);
            }

            soc.memory.setWord16AtByteIndex(addr,soc.reg()[op2]);
        }
        else
        {
            soc.triggerException(2);
        }
    }       
    this.instructionset.getByMnemonic("ld8").handler = function(op1,op2,number)
    {
        if (op1<=15)
        {
            var addr;
            if (op2==31)
            {
                addr = number;
            }
            else if (op2<=15)
            {
                addr = soc.reg()[op2];
            }
            else
            {
                soc.triggerException(2);
            }
            soc.reg()[op1]=soc.memory.getByteAtByteIndex(addr);
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("st8").handler = function(op1,op2,number)
    {
        if (op2<=15)
        {
            var addr;
            if (op1==31)
            {
                addr = number;
            }
            else if (op1<=15)
            {
                addr = soc.reg()[op1];
            }
            else
            {
                soc.triggerException(2);
            }

            soc.memory.setByteAtByteIndex(addr,soc.reg()[op2]);
        }
        else
        {
            soc.triggerException(2);
        }
    }
    this.instructionset.getByMnemonic("call").handler = function(op1,op2,number)
    {
        var handler = null;
        if (op1=31)
        {
            handler = number;
        }
        else if (op1<=15)
        {
            handler =soc.reg()[op1];
        }
        else
        {
            soc.triggerException(2);
        }
        soc.push(soc.reg()[15]);
        soc.reg()[15] = handler-8; // -8 because it will be incremented after
    }
    this.instructionset.getByMnemonic("ret").handler = function(op1,op2,number)
    {
        soc.reg()[15] = soc.pop(); 
    }
    this.instructionset.getByMnemonic("ireg").handler = function(op1,op2,number)
    {
        if (op1>15) soc.triggerException(2);
        var handler = null;
        if (op2==31)
        {
            handler = number;
        }
        else if (op2<=15)
        {
            handler =soc.reg()[op2];
        }
        else
        {
            soc.triggerException(2);
        }
        var n = soc.reg()[op1];
        if (n>soc.irqHandlers.length) soc.triggerException(0);

        soc.irqHandlers[n] = handler;
    }

    this.instructionset.getByMnemonic("reg").handler = function(op1,op2,number)
    {
        if (op1>15) soc.triggerException(2);
        var handler = null;
        if (op2==31)
        {
            handler = number;
        } 
        else if (op2<=15)
        {
            handler =soc.reg()[op2];
        }
        else
        {
            soc.triggerException(2);   
        }
        var n = soc.reg()[op1];
        if (n>soc.exceptionHandlers.length) soc.triggerException(0);

        soc.exceptionHandlers[n] = handler;
    }
    this.instructionset.getByMnemonic("eret").handler = function(op1,op2,number)
    {
        soc.flags &= ~(1<<3);
        soc.reg()[15] = soc.pop(); 
    }
    this.instructionset.getByMnemonic("iret").handler = function(op1,op2,number)
    {
        soc.switchRegisterBank(Bank.GenericBank);
        soc.flags = soc.pop();
    }
    this.instructionset.getByMnemonic("jmp").handler = function(op1,op2,number)
    {
        soc.reg()[15] = number-8; // -8 because it will be incremented after
    }

    this.instructionset.getByMnemonic("cli").handler = function(op1,op2,number)
    {
        soc.flags &= ~(1<<2);
    }

    this.instructionset.getByMnemonic("sti").handler = function(op1,op2,number)
    {
        soc.flags |= (1<<2);
    }

    this.instructionset.getByMnemonic("break").handler = function(op1,op2,number)
    {
        soc.reg()[15]+=8;  // because we want to be able to continue after
        soc.triggerException(0);
    }

}

SoC.prototype.switchRegisterBank = function(bank)
{
    this.registers = this.registerBanks[bank];
}
SoC.prototype.reg = function()
{
    return this.registers;
}

SoC.prototype.reset = function()
{
    console.log("reset");
    this.registerBanks = [new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
                          new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])];
    this.switchRegisterBank(Bank.GenericBank);
    this.flags = 0;
    if (this.keyboard) this.keyboard.clear();
}

SoC.prototype.loadProgram = function(code)
{
    this.reset();
    this.memory.copyAt(code,0);
}

SoC.prototype.triggerException = function(id)
{
    throw {"Exception":id,"registers":(this.registers),"flags":this.flags, "at":(this.reg()[15])};
}

SoC.prototype.executeOneInstruction = function()
{
    var r15 = this.reg()[15];
    var newr15;

    try
    {
        if ((r15%8)!=0) this.triggerException(1); // Invalid instruction because it is not aligned on a 64bit boundary
        var word1 = this.memory.getWordAtByteIndex(r15);
        var word2 = this.memory.getWordAtByteIndex(r15+4);

        var opcode = word1&0xFF;
        var ops = word1>>>8;
        var op1 = ops&31;
        var op2 = (ops>>>5)&31;
        var number = word2; 

        var instruction = this.instructionset.getByOpcode(opcode);
        var condition = this.instructionset.getConditionByCode((word1>>>18)&15);
        if ((instruction === undefined) || (condition === undefined)) this.triggerException(1);
        if (condition.handler())
        {
            if (!instruction.handler) triggerException(1);
            instruction.handler(op1,op2,number);
        }

        newr15 = this.reg()[15]+8;

        // if i flag is set, process device IRQs
        if (this.flags & (1<<2))
        {
            if (this.keyboard != null)
            {
                if (this.keyboard.hasPendingIRQ())
                {
                    if (this.irqHandlers[1] != null)
                    {
                        this.push(this.flags);
                        this.switchRegisterBank(Bank.InteruptBank);
                        this.flags &= ~(1<<2);
                        newr15 = this.irqHandlers[1];
                    } 
                }
            }
        }
    }
    catch (e)
    {  
        if (e.Exception === undefined)
        {
            console.log("some bogus exception at "+r15);
            throw e;
        }

        if (e.Exception != 0)
        {
            if ((this.flags&(1<<3)) != 0) this.doubleFault();
            this.flags |= (1<<3); // set the "Exception" flag unless it's a breakpoint exception
            e.flags = this.flags; // re-update it
        }
        // It is possible that the memory object has thrown and it won't set "at" and "registers" so do it here.
        if(e.registers === undefined)
        {
            e.registers = this.registers
            e.flags = this.flags
            e.at = this.reg()[15];
        }
        // if a handler has not been registered, throw the exception to the debugger.
        if (this.exceptionHandlers[e.Exception] == null)
        {
            this.refreshDevices();
            throw e;
        }

        // we push the address of the faulty instruction and we jump to the handler
        try
        {
            this.push(this.reg()[15]-8); // this may throw also
        }
        catch (e)
        {
            this.doubleFault();
        }
        newr15 = this.exceptionHandlers[e.Exception];
    }

    this.reg()[15] = newr15;
}

SoC.prototype.doubleFault = function()
{
    // We are already servicing an exception and another one occured? reset!
    var r15 = this.reg()[15];
    this.reset();
    throw {"Exception":-1,"registers":(this.registers),"flags":this.flags, "at":r15};
}

SoC.prototype.stepByStep = function()
{
    this.executeOneInstruction();
    this.refreshDevices()

    // This one will throw outside of the executuon function so will not be cuaght by software handlers.
    // so only the debugger will catch it.
    this.triggerException(0); 
}

SoC.prototype.runContinuous = function(loops)
{
    // This will break when exception is thrown and when VM terminates
    // It can also act as a "resume" when the vm stopped
    for (var i=0;i<loops;i++)
    {
        this.executeOneInstruction();
    }
    this.refreshDevices(); 
}

SoC.prototype.refreshDevices = function()
{
    if (this.screen != null) this.screen.refresh();
}

SoC.prototype.push = function(val)
{
    this.reg()[14] -=4;
    this.memory.setWordAtByteIndex(this.reg()[14], val);
}

SoC.prototype.pop = function()
{
    var word = this.memory.getWordAtByteIndex(this.reg()[14]);
    this.reg()[14] +=4;
    return word;
}

SoC.prototype.getMemorySize = function()
{
    return this.memory.size;
}

SoC.prototype.setKeyboard = function(keyboard)
{
    this.keyboard = keyboard;
    var buf = keyboard.getControlBuffer();
    this.memory.setDeviceMemory(0xF3000000,buf);
}

SoC.prototype.setScreen = function(video)
{
    this.screen = video;
    var buf = video.getVGABuffer();
    var mmio = video.getMMIOBuffer();
    var text = video.getTextBuffer();
    this.memory.setDeviceMemory(0xF0000000,buf);
    this.memory.setDeviceMemory(0xF1000000,text);
    this.memory.setDeviceMemory(0xF2000000,mmio);
}


function Memory(size)
{
    this.size = size >>> 0;
    this.deviceMemories = [];
    var mem = new ArrayBuffer(this.size);
    this.setDeviceMemory(0,{memory:mem,readhandler:null,size:size}); //Warning: size must be less than 256mb
}

Memory.prototype.getWordAtByteIndex = function(index)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,4,true);
    if (m==null)  throw {"Exception":4};
    return (m.data[m.offset]|(m.data[m.offset+1]<<8)|(m.data[m.offset+2]<<16)|(m.data[m.offset+3]<<24))>>>0;
}

Memory.prototype.setWordAtByteIndex = function(index, word)
{
    index = index >>> 0; // convert to unsigned
    var m =this.validateMemRange(index,4,false);
    if (m==null)  throw {"Exception":4};
    m.data[m.offset] = (word&0xFF);
    m.data[m.offset+1] = ((word>>>8)&0xFF);
    m.data[m.offset+2] = ((word>>>16)&0xFF);
    m.data[m.offset+3] = ((word>>>24)&0xFF);
}

Memory.prototype.getWord16AtByteIndex = function(index)
{
    index = index >>> 0; // convert to unsigned
    var m =this.validateMemRange(index,2,true);
    if (m==null)  throw {"Exception":4};
    return (m.data[m.offset]|(m.data[m.offset+1]<<8))>>>0;
}

Memory.prototype.setWord16AtByteIndex = function(index, word)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,2,false);
    if (m==null)  throw {"Exception":4};
    m.data[m.offset] = (word&0xFF);
    m.data[m.offset+1] = ((word>>>8)&0xFF);
}

Memory.prototype.getByteAtByteIndex = function(index)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,1,true);
    if (m==null)  throw {"Exception":4};
    return m.data[m.offset]>>>0;
}

Memory.prototype.setByteAtByteIndex = function(index, word)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,1,false);
    if (m==null)  throw {"Exception":4};
    m.data[m.offset] = (word&0xFF);
}

Memory.prototype.validateMemRange = function(address,size,read)
{
    var m = this.deviceMemories[address>>>24];
    if (m==null) return null;

    var s = m.start;
    var buffer = m.data;
    var e = s+m.size;
    if ((address >= s)&&((address+size-1)<e))
    {
        var ret = {"data":buffer,"offset":(address-s)};
        if (read && m.handler) m.handler.onBeforeMemoryRead(ret.offset,size);
        return ret; 
    }
    return null;
}   

Memory.prototype.setDeviceMemory = function(address,buffer)
{
    if ((address%(1<<24))>0) throw {"error":"MemoryError","details":"Address must be aligned on 256mb boundary"};
    var index = (address >>> 24);
    this.deviceMemories[index] = {"start":address,"data":buffer.memory,"size":buffer.size,"handler":buffer.handler};
}

Memory.prototype.copyAt = function(source,index)
{
    var m = this.validateMemRange(index,source.length,false); 
    if (m==null) throw {"error":"MemoryError","details":"Invalid address"};
    var offset = m.offset;
    for (var i = 0; i < source.length; i++)
    {
        m.data[offset+i] = source[i];
    }
}
function Assembler()
{
    this.instructionset = new InstructionSet();
}

Assembler.prototype.encodeLine = function(line)
{
    line = line.trim();
    if (line == "") return null;
    var regex = /^([ \ta-zA-Z]*:)?[ \t]*(\$?[a-zA-Z0-9]*)(\.[a-zA-Z]*)?[ \t]*(.*)$/m
    var matches = line.match(regex);
    var label = "";
    var condition = "";
    var mnemonic = "";
    var op1 = "";
    var op2 = "";
    if (matches[4] != null)
    {
        var ops = matches[4].split(/;/)[0].split(/,/);
        op1 = ops[0];
        op2  =ops[1];
    }
   
    if (matches[1] != null) label = matches[1].trim().replace(/:/,'');
    if (matches[2] != null) mnemonic = matches[2].trim();
    if (matches[3] != null) condition = matches[3].trim().replace(/\./,'');
    if (op1 != null) op1 = op1.trim();
    if (op2 != null) op2 = op2.trim();
    if (mnemonic[0]!='$') // if it starts by '$', it is an assembler directive.
    {
        return this.encodeInstruction(line, label, mnemonic,condition, op1, op2);
    }
    else
    {
        return this.encodeDirective(line, label, mnemonic, op1);
    }
}

Assembler.prototype.encodeDirective = function(line, label, mnemonic, op1)
{
    var dataSize;
    var vals = [];
    if (mnemonic == "$WORD32")
    {
        dataSize = 32;
        vals.push(op1);
    }
    else if (mnemonic == "$WORD16")
    {
        dataSize = 16;
        vals.push(op1);
    }
    else if (mnemonic == "$BYTE")
    {
        dataSize = 8;
        vals.push(op1);
    }
    /*else if (mnemonic == "$ASCII")
    {
        dataSize = 8;
       //TODO: op1 will need to be in the format of "...". The regex does not support that right now 
        vals.push(op1);
    }*/
    else
    {
        return {"result":"error","description":line, "reason": "Invalid assembler directive: ["+mnemonic+"]"};
    }

    return {"result":"success", "datasize": dataSize, "values":vals, "label":label};
}

Assembler.prototype.encodeInstruction = function(line, label, mnemonic,condition, op1, op2)
{
    var registers = {"r0":0,"r1":1,"r2":2,"r3":3,"r4":4,"r5":5,"r6":6,"r7":7,"r8":8,
                     "r9":9,"r10":10,"r11":11,"r12":12,"r13":13,"r14":14,"r15":15};
    var instruction = this.instructionset.getByMnemonic(mnemonic);
    if (instruction.mnemonic !== mnemonic) 
    {
        return {"result":"error","description":line, "reason": "Unknown instruction: ["+mnemonic+"]"};
    }

    var number = "";
    var number1 = undefined;
    var number2 = undefined;
    // decode operand 1 and 2
    if (op1 in registers)
    {
       op1 = registers[op1];
    }
    else
    {
        number1 = op1;
        if (op1!=""&&op1!==undefined) op1 = 31; else op1 = 30;
    }
    
    if (op2 in registers)
    {
        op2 = registers[op2];
    }
    else
    {
        number2 = op2;
        if (op2!=""&&op2!==undefined) op2 = 31; else op2=30;
    }

    // Cannot have 2 numeric values
    if (number1 !== undefined && number2 !== undefined)
    {
        return {"result":"error","description":line, "reason": "Cannot code 2 numbers"};
    }
    if (number1 !== undefined) number = number1; else if (number2 !== undefined) number = number2;

    if (condition == "") condition = "al"; // default is always
    var cond = this.instructionset.getConditionByMnemonic(condition);
    if (cond==null) return {"result":"error", "description":line, "reason": "Invalid condition: ["+condition+"]"};
    condition = cond.code;
    var code = (instruction.opcode | ((op1&31)<<8) | ((op2&31)<<13) | ((condition&15)<<18));

    return {"result":"success", "code1": code, "code2":number, "label":label};
} 

Assembler.prototype.assemble = function(source)
{
    var a = this;
    var compiled = [];
    var lines = source.match(/[^\r\n]+/g);
    if (lines == null) return {"result":"error","description":"","reason":"No code"};
    for (var i = 0; i < lines.length; i++)
    {
        r = a.encodeLine(lines[i]);
        if (r == null) continue;
        if (r.result === "error") return r;
        compiled.push(r);
    }
    var breakadd = compiled.length*8;
    compiled.push(a.encodeLine("protectionlabelthatshouldnotbeusedbyprogrammer: break"));
    compiled.push(a.encodeLine("jmp protectionlabelthatshouldnotbeusedbyprogrammer"));

    // now resolve labels
    var bin = [];
    for (var i = 0; i < compiled.length; i++)
    {
        if (compiled[i].code1 !== undefined)
        {
            var ret = this.resolveNumber(lines[i],compiled,compiled[i].code2);
            if (ret.result != "success") return ret;
            if ((bin.length%8)!=0)
            {
                // This could happen if some data directives were written before and they 
                // have screwed up the alignment
                return {"result":"error","description":lines[i], "reason":"instruction not aligned on 64bit boundary: 0x"+bin.length.toString(16)};
            }

            var code1 = compiled[i].code1;
            var code2 = ret.value;
            bin.push(code1&0xFF);
            bin.push((code1>>8)&0xFF);
            bin.push((code1>>16)&0xFF);
            bin.push((code1>>24)&0xFF);
            bin.push(code2&0xFF);
            bin.push((code2>>8)&0xFF);
            bin.push((code2>>16)&0xFF);
            bin.push((code2>>24)&0xFF);
        }
        else
        {
            for (var n=0;n<compiled[i].values.length;n++)
            {
                var val = compiled[i].values[n];
                var valSize = compiled[i].datasize;
                var ret = this.resolveNumber(lines[i],compiled,val);
                if (ret.result != "success") return ret;

                if (valSize == 8)
                {
                    bin.push(val&0xFF);
                }
                else if (valSize == 16)
                {
                    bin.push(val&0xFF);
                    bin.push((val>>8)&0xFF);
                }
                else if (valSize == 32)
                {
                    bin.push(val&0xFF);
                    bin.push((val>>8)&0xFF);
                    bin.push((val>>16)&0xFF);
                    bin.push((val>>24)&0xFF);
                }
            }
        }
    }

    return {"result":"success", "binary":bin};
}

Assembler.prototype.resolveNumber = function(line, compiled,number)
{
    if (number.indexOf("0b")==0)
    {
        number = parseInt(number.substr(number,2),2);
    }
    if (isNaN(number)) // if it is text, it means it is a label
    {
        var offset = 0;
        for (var n = 0; n < compiled.length; n++)
        {
            if (compiled[n].label == number)
            {
                number = offset; 
                break;
            }
            if (compiled[n].datasize !== undefined) offset += (compiled[n].datasize/8); else offset+=8;
        }
        if (isNaN(number)) return {"result":"error","description":line, "reason":"Label not found"};
    }
    else
    {
        number = Number(number);
    }

    if (number > 4294967295) return {"result":"error","description":line, "reason":"Number too big"};

    return {"result":"success","value":number};
}


function Disassembler()
{
    this.instructionset = new InstructionSet();
}

Disassembler.prototype.disassemble = function(code)
{
    var source = "";
    for (var i = 0; i < code.length; i+=8)
    {
        var instruction = this.instructionset.getByOpcode(code[i]);
        var condition = this.instructionset.getConditionByCode((code[i+2]>>2)&15);
        if (condition == null) condition = "??"; else condition=condition.condition;

        linenum = (i.toString(16));
        var missing = 8-linenum.length;
        for (var p = 0; p<(missing);p++) linenum = "0"+linenum;
        source += linenum + ":  "+instruction.mnemonic+"."+condition+"\t";

        var ops = (code[i+1]|(code[i+2]<<8));
        var op1 = ops&31;
        var op2 = (ops>>5)&31;
        var number = ((code[i+4])|(code[i+5]<<8)|(code[i+6]<<16)|(code[i+7]<<24)) >>> 0;
   

        if (op1 == 31)
        {
            source+="0x"+number.toString(16);
        }
        else if (op1==30)
        {
            // it means no op1 is defined, so no ops at all.
        }
        else
        {
            source+="r"+op1;
        }

        if (op2 == 31)
        {
            source+=",0x"+number.toString(16);
        }
        else if (op2==30)
        {
            // it means no op1 is defined, so no ops at all.
        }
        else
        {
            source+=",r"+op2;
        }

        source+="\r\n";
    }

    return source;
}
function buildTable()
{
    var table = document.createElement("table");
    table.className = "textconsole";
    var tbody = document.createElement("tbody");
    for (var y=0;y<25;y++)
    {
        var tr = document.createElement("tr");
        for (var x=0;x<80;x++)
        {
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return table;
}

function Video(c)
{
    this.container = c;
    this.text = buildTable();
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "320px";
    this.canvas.style.height = "200px";
    this.container.appendChild(this.canvas);
    
    this.mmio = new Uint8Array(256);
    this.mmio[0]=0;
    this.textBuffer = new Uint8Array(80*25);
    
    this.currentMode = 0; 
    this.screenContext = this.canvas.getContext("2d");
    this.screenBuffer = this.screenContext.getImageData(0,0,320,200);
}

Video.prototype.updateTextScreen = function()
{
    var cells = this.text.getElementsByTagName('td');
    for (var i=0;i<cells.length;i++)
    {
        var ch = this.textBuffer[i];    
        if (ch==0) ch = 32;
        ch = String.fromCharCode(this.textBuffer[i]);    
        cells[i].innerHTML = ch; 
    }
}


Video.prototype.getVGABuffer = function()
{
    return {memory:this.screenBuffer.data, handler:null,size:this.screenBuffer.data.length};
}

Video.prototype.getTextBuffer = function()
{
    return {memory:this.textBuffer, handler:null,size:this.textBuffer.length};
}

Video.prototype.getMMIOBuffer = function()
{
    return {memory:this.mmio, handler:null,size:this.mmio.length};
}

Video.prototype.refresh = function()
{
    if (this.currentMode != this.mmio[0])
    {
        this.currentMode = this.mmio[0];
        if (this.currentMode == 0)
        {
            this.container.innerHTML="";
            this.container.appendChild(this.canvas);
        }
        else if (this.currentMode == 1)
        {
            this.container.innerHTML="";
            this.container.appendChild(this.text);
        }
    }

    if (this.currentMode == 0)
    {
        this.screenContext.putImageData(this.screenBuffer, 0, 0);
    }
    else if (this.currentMode == 1)
    {
        this.updateTextScreen();        
    }
}

/*
    To read a key: user must check if control[0]==1, then read from control[1] and clear control[0]
*/

function Keyboard()
{
    this.control = new Uint8Array(2);
    this.clear();
}

Keyboard.prototype.getControlBuffer = function()
{
    var k = this;
    return {memory:this.control, handler:this, size:this.control.length };
}

Keyboard.prototype.onBeforeMemoryRead = function(address,size)
{
    if (address==1)
    {
        if (this.keyEvents.length>0)
        {  
            var v =  this.keyEvents.shift();
            this.control[1] = (v.key)>>>0;
        }
        else
        {
            this.control[1] = 0;
        }
    }
    else if (address==0)
    {
        this.control[0] = this.keyEvents.length;
    }
}

Keyboard.prototype.clear = function()
{
    this.keyEvents = [];
    for (var i=0;i<this.control.length;i++) this.control[i]=0;
}

Keyboard.prototype.onkeypress = function(key)
{
    this.keyEvents.push({"key":key});
}

Keyboard.prototype.hasPendingIRQ = function()
{
    return (this.keyEvents.length>0);
}
