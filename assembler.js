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


