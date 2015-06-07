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
