all:
	cat instructionset.js > vm.js
	cat computer.js >> vm.js
	cat memory.js >> vm.js
	cat assembler.js >> vm.js
	cat disassembler.js >> vm.js
	cat video.js >> vm.js
	cat keyboard.js >> vm.js
	cp vm.js nodejs/vmlib.js
	cat nodejs.exports >> nodejs/vmlib.js
	mkdir www
	cp vm.js www/
	cp style.css www/
	cp index.html www/
	cp documentation.html www/
	cp samples.txt www/
