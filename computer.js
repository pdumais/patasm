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


