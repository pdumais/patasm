function Memory(size)
{
    this.size = size >>> 0;
    this.deviceMemories = [];
    var mem = new ArrayBuffer(this.size);
    this.setDeviceMemory(0,{memory:mem,readhandler:null,size:size}); //Warning: size must be less than 256mb
}

Memory.prototype.getWordAtByteIndex = function(index)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,4,true);
    if (m==null)  throw {"Exception":4};
    return (m.data[m.offset]|(m.data[m.offset+1]<<8)|(m.data[m.offset+2]<<16)|(m.data[m.offset+3]<<24))>>>0;
}

Memory.prototype.setWordAtByteIndex = function(index, word)
{
    index = index >>> 0; // convert to unsigned
    var m =this.validateMemRange(index,4,false);
    if (m==null)  throw {"Exception":4};
    m.data[m.offset] = (word&0xFF);
    m.data[m.offset+1] = ((word>>>8)&0xFF);
    m.data[m.offset+2] = ((word>>>16)&0xFF);
    m.data[m.offset+3] = ((word>>>24)&0xFF);
}

Memory.prototype.getWord16AtByteIndex = function(index)
{
    index = index >>> 0; // convert to unsigned
    var m =this.validateMemRange(index,2,true);
    if (m==null)  throw {"Exception":4};
    return (m.data[m.offset]|(m.data[m.offset+1]<<8))>>>0;
}

Memory.prototype.setWord16AtByteIndex = function(index, word)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,2,false);
    if (m==null)  throw {"Exception":4};
    m.data[m.offset] = (word&0xFF);
    m.data[m.offset+1] = ((word>>>8)&0xFF);
}

Memory.prototype.getByteAtByteIndex = function(index)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,1,true);
    if (m==null)  throw {"Exception":4};
    return m.data[m.offset]>>>0;
}

Memory.prototype.setByteAtByteIndex = function(index, word)
{
    index = index >>> 0; // convert to unsigned
    var m = this.validateMemRange(index,1,false);
    if (m==null)  throw {"Exception":4};
    m.data[m.offset] = (word&0xFF);
}

Memory.prototype.validateMemRange = function(address,size,read)
{
    var m = this.deviceMemories[address>>>24];
    if (m==null) return null;

    var s = m.start;
    var buffer = m.data;
    var e = s+m.size;
    if ((address >= s)&&((address+size-1)<e))
    {
        var ret = {"data":buffer,"offset":(address-s)};
        if (read && m.handler) m.handler.onBeforeMemoryRead(ret.offset,size);
        return ret; 
    }
    return null;
}   

Memory.prototype.setDeviceMemory = function(address,buffer)
{
    if ((address%(1<<24))>0) throw {"error":"MemoryError","details":"Address must be aligned on 256mb boundary"};
    var index = (address >>> 24);
    this.deviceMemories[index] = {"start":address,"data":buffer.memory,"size":buffer.size,"handler":buffer.handler};
}

Memory.prototype.copyAt = function(source,index)
{
    var m = this.validateMemRange(index,source.length,false); 
    if (m==null) throw {"error":"MemoryError","details":"Invalid address"};
    var offset = m.offset;
    for (var i = 0; i < source.length; i++)
    {
        m.data[offset+i] = source[i];
    }
}
