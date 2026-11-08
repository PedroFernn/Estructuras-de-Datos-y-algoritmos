/* ============ Recorder: implementa la API `visualizer` ============ */
// Ejecuta el algoritmo UNA vez, graba "frames" y luego el Player los reproduce (permite paso atrás y no congela la UI).
class Recorder{
 constructor(g){this.g=g;this.s={n:{},e:{},ds:{}};this.logs=[];this.cnt=0;this.frames=[this.snap()]}
 snap(){return{n:{...this.s.n},e:{...this.s.e},ds:JSON.parse(JSON.stringify(this.s.ds,(k,v)=>v===Infinity?'∞':v)),l:this.logs.length}}
 async push(){
  if(++this.cnt>5000)throw Error('Límite de 5000 pasos (¿bucle infinito?)');
  this.frames.push(this.snap());
  if(this.cnt%100===0)await new Promise(r=>setTimeout(r)); // cede el hilo a la UI
 }
 async visitNode(id,st='visited'){this.s.n[id]=st;await this.push()}
 async highlightEdge(u,v,st='path'){this.s.e[this.g.key(u,v)]=st;await this.push()}
 async log(m){this.logs.push(String(m));await this.push()}
 async setStructure(name,val){this.s.ds[name]=Array.isArray(val)?[...val]:(val&&typeof val==='object'?{...val}:val);await this.push()}
 async showPath(p){for(let i=0;i<p.length;i++){this.s.n[p[i]]='path';if(i)this.s.e[this.g.key(p[i-1],p[i])]='path';await this.push()}}
}
