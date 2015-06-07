# Javascript virtual assembly
This is a javascript virtual machine that emulates an imaginary architecture. It has no real purpose
other than being fun to play with. It emulates a virtual CPU with my own instruction set.

# Documentation
See documentation.html in the project for the virtual CPU architecture.

# Building
This is a javascript application that runs 100% client side. There is a Mafile in the project.
The Makefile will only merge all js files into one and move everything that is needed in the www folder
and a nodejs folder

# node.js
It is possible to use the assembler, disassembler and emulator at the command-line (no web interface)
using node.js.

Example:
* Assembling a binary: ./as.js test.asm
* Disassembling a binary: ./deasm.js rom.bin
* Running a binary: ./vm.js rom.bin

You can assemble a binary in the web UI and use it from the command-line and vice-versa

Note that when using the command-line vm, you cannot interact with your program. The VM
will execute your program until an exception occurs and will dump the registers content on the shell.

# Example
See a live demo at http://www.dumaisnet.ca/vm

# Website
http://www.dumaisnet.ca/index.php?article=d2603da41bd211d09df9aa17e4b2e915
