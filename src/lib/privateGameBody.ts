// Consume at most the private login byte limit, including streams without Content-Length.
export async function privateGameBody(request: Request, limit = 2048): Promise<string | null> {
 if(!request.body)return '';
 const reader=request.body.getReader(),chunks:Uint8Array[]=[];let bytes=0;
 try { while(true){const next=await reader.read();if(next.done)break;bytes+=next.value.byteLength;if(bytes>limit){await reader.cancel().catch(()=>{});return null;}chunks.push(next.value);} }
 finally{reader.releaseLock();}
 const value=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){value.set(chunk,offset);offset+=chunk.byteLength;}
 return new TextDecoder().decode(value);
}
