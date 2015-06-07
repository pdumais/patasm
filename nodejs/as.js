#!/usr/local/bin/node

var fs = require("fs");
var VM = require('./vmlib.js');
var a = new VM.Assembler();

var input = process.argv[2];
if (input === undefined)
{
    console.log("Usage: "+process.argv[1]+" inputfile.asm\r\n");
    return;
}
var data = fs.readFileSync(input,"utf8");
var result = a.assemble(data);
if (result.result != "success") 
{
    console.log(JSON.stringify(result));
}
else
{
    //var buf = new Uint8Array(result.binary);
    var buf = new Buffer(result.binary);
    fs.writeFileSync("rom.bin", buf,  "binary");
    console.log("Success creating rom.bin\r\n");
}



