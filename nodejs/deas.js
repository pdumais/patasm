#!/usr/local/bin/node

var fs = require("fs");
var VM = require('./vmlib.js');
var d = new VM.Disassembler();

var input = process.argv[2];
if (input === undefined)
{
    console.log("Usage: "+process.argv[1]+" rom.bin\r\n");
    return;
}
var data = fs.readFileSync(input);
var result = d.disassemble(data);

console.log(result+"\r\n");




