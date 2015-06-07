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
