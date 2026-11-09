/* ============ Estructuras lineales y heaps ============ */
// La secuencia de valores es la fuente de verdad: cada operación la lee, la modifica y reconstruye el grafo.
// Cadena: arreglo, pila, cola, deque, cola de prioridad, lista doble/circular. Heap: árbol binario por índice.
let LIN_UID=0;
const noVal=f=>Object.assign(f,{noval:true});
const before=(x,y,max)=>max?+x>+y:+x<+y;
function heapPush(a,v,max){a.push(v);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(!before(a[i],a[p],max))break;[a[i],a[p]]=[a[p],a[i]];i=p}}
function heapPop(a,max){if(!a.length)return;a[0]=a[a.length-1];a.pop();let i=0;for(;;){const l=2*i+1,r=l+1;let b=i;if(l<a.length&&before(a[l],a[b],max))b=l;if(r<a.length&&before(a[r],a[b],max))b=r;if(b===i)break;[a[i],a[b]]=[a[b],a[i]];i=b}}
const hops=m=>({'Insertar':(a,v)=>heapPush(a,v,m),'Extraer raíz':noVal(a=>heapPop(a,m))});
const listOps={'Insertar final':(s,v)=>s.push(v),'Insertar inicio':(s,v)=>s.unshift(v),'Eliminar':(s,v)=>{const i=s.indexOf(v);if(i>=0)s.splice(i,1)}};

const LIN={
 array:{build:'chain',sample:['1','3','5','7','9','11','13'],ops:{'Agregar final':(s,v)=>s.push(v),'Quitar último':noVal(s=>s.pop())}},
 stack:{build:'chain',sample:['4','2','7'],ops:{'Push':(s,v)=>s.unshift(v),'Pop':noVal(s=>s.shift())}},
 queue:{build:'chain',sample:['4','2','7'],ops:{'Encolar':(s,v)=>s.push(v),'Desencolar':noVal(s=>s.shift())}},
 deque:{build:'chain',sample:['4','2','7'],ops:{'Frente +':(s,v)=>s.unshift(v),'Fondo +':(s,v)=>s.push(v),'Quitar frente':noVal(s=>s.shift()),'Quitar fondo':noVal(s=>s.pop())}},
 pq:{build:'chain',num:true,sample:['5','1','8','3'],ops:{'Insertar':(s,v)=>{s.push(v);s.sort((a,b)=>+a-+b)},'Extraer mín':noVal(s=>s.shift())}},
 dlist:{build:'dbl',sample:['4','7','2','9'],ops:listOps},
 clist:{build:'circ',sample:['4','7','2','9'],ops:listOps},
 heap:{build:'heap',num:true,max:false,sample:[5,3,8,1,9,2],ops:hops(false)},
 heapmax:{build:'heap',num:true,max:true,sample:[5,3,8,1,9,2],ops:hops(true)}
};

// Secuencia de valores en orden (cabeza → cola) o orden de índice para heaps.
function linSeq(t){
 if(LIN[t].build==='heap')return G.nodes.map(n=>n.label??n.id);
 if(!G.nodes.length)return[];
 const inc=new Set(G.edges.filter(e=>e.kind!=='prev').map(e=>e.v));
 let u=(G.nodes.find(n=>!inc.has(n.id))||G.nodes[0]).id;
 const out=[],seen=new Set();
 while(u!==undefined&&!seen.has(u)){seen.add(u);const n=G.nd(u);out.push(n.label??n.id);const e=G.edges.find(e=>e.u===u&&e.kind!=='prev');u=e?e.v:undefined}
 return out;
}
// Reconstruye nodos y aristas a partir de la secuencia de valores.
function linSet(t,vals){
 const cfg=LIN[t];G.nodes=[];G.edges=[];
 const ids=vals.map(v=>{const id='v'+(++LIN_UID);G.nodes.push({id,label:String(v),x:0,y:0});return id});
 const E=(u,v,kind)=>G.edges.push({u,v,w:1,kind});
 if(cfg.build==='heap')ids.forEach((id,i)=>{if(i)E(ids[(i-1)>>1],id,'child')});
 else{
  for(let i=1;i<ids.length;i++){E(ids[i-1],ids[i],'next');if(cfg.build==='dbl')E(ids[i],ids[i-1],'prev')}
  if(cfg.build==='circ'&&ids.length>1)E(ids[ids.length-1],ids[0],'next');
 }
}
function linOp(t,name,v){
 const a=linSeq(t);LIN[t].ops[name](a,v);linSet(t,a);
}
for(const t in LIN){
 OPS[t]={};
 for(const name in LIN[t].ops){
  const w=v=>linOp(t,name,v);w.noval=!!LIN[t].ops[name].noval;OPS[t][name]=w;
 }
}
// Layout de heap: niveles por altura, posiciones horizontales por índice dentro del nivel.
function layoutHeap(W,H){
 const n=G.nodes.length;if(!n)return;
 const maxL=Math.floor(Math.log2(n)),dy=Math.min(90,(H-100)/Math.max(maxL,1));
 G.nodes.forEach((nd,i)=>{const L=Math.floor(Math.log2(i+1)),j=i+1-2**L,cnt=2**L;nd.x=(j+.5)*W/cnt;nd.y=50+L*dy});
}
function loadLinSample(t){
 const cfg=LIN[t];let a=[];
 if(cfg.build==='heap')cfg.sample.forEach(v=>heapPush(a,v,cfg.max));else a=cfg.sample.slice();
 linSet(t,a);changed();
}
