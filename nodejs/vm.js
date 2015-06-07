#!/usr/local/bin/node

var fs = require("fs");
var VM = require('./vmlib.js');
var system = new VM.SoC();
var d = new VM.Disassembler();

var input = process.argv[2];
if (input === undefined)
{
    console.log("Usage: "+process.argv[1]+" rom.bin\r\n");
    return;
}
var data = fs.readFileSync(input);

var lines = d.disassemble(data).split(/\n/);
system.loadProgram(data);

console.log("\r\n");
while(1)
{
    try
    {
        system.runContinuous(100000);
    }
    catch (e)
    {
        if (e.Exception === undefined) throw e;
        var registers = new Uint32Array(e.registers);

        var st = "Exception "+e.Exception+" - ";
        switch (e.Exception)
        {
            case -1: st+="Double fault exception - VM will reset"; break;
            case 0: st+="Breakpoint"; break;
            case 1: st+="Undefined Instruction"; break;
            case 2: st+="Invalid operand"; break;
            case 3: st+="Division by zero"; break;
            case 4: st+="Illegal memory access"; break;
        };
        console.log("=================== "+st+" ===================");

        console.log("At:");
        var line = registers[15]>>3;
        var sl = line-5;
        var el = line+5;
        if (sl<0) sl=0;
        if (el>=lines.length) el=(lines.length-1);
        for (var i=sl;i<=el;i++)
        {   
            var st = lines[i];
            if (i == line) st = "---> "+st; else st="     "+st;
            console.log(st);
        }

        console.log("Registers:");
        for (var i = 0; i<16; i++)
        {
            var val = registers[i].toString(16);
            var missing = 8-val.length;
            for (var p=0;p<missing;p++) val="0"+val;
            console.log("\tr"+i+": 0x"+val);
        } 

        var val = e.flags.toString(2);
        var missing = 32-val.length;
        for (var p=0;p<missing;p++) val="0"+val;
        console.log("\tFlags: 0b"+val);
        console.log("\r\n");
        return;

    }
}




