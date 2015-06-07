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

