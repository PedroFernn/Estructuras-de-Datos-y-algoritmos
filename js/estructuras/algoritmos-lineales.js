/* ============ Algoritmos de estructuras lineales, heaps y grafos extra (se ejecutan en el Worker) ============ */
Object.assign(ALGS,{
'Arreglo: búsqueda binaria':`const n=graph.len, t=Number(params.val), a=[];
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
if(a.some((x,i)=>i&&x<a[i-1])) await visualizer.log('⚠ El arreglo no está ordenado: la búsqueda binaria puede fallar');
let lo=0,hi=n-1;
while(lo<=hi){
  const mid=(lo+hi)>>1;
  await visualizer.visitNode(graph.at(mid),'current');
  await visualizer.log('lo='+lo+' hi='+hi+' mid='+mid+' valor='+a[mid]);
  if(a[mid]===t){ await visualizer.visitNode(graph.at(mid),'path'); await visualizer.log('Encontrado en índice '+mid); return; }
  await visualizer.visitNode(graph.at(mid),'visited');
  if(a[mid]<t) lo=mid+1; else hi=mid-1;
}
await visualizer.log('No encontrado');`,

'Arreglo: two pointers (suma objetivo)':`const n=graph.len, t=Number(params.val), a=[];
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
if(a.some((x,i)=>i&&x<a[i-1])) await visualizer.log('⚠ El arreglo debe estar ordenado');
let i=0,j=n-1;
while(i<j){
  await visualizer.visitNode(graph.at(i),'current');
  await visualizer.visitNode(graph.at(j),'current');
  const s=a[i]+a[j];
  await visualizer.log('i='+i+' j='+j+' suma='+s+' objetivo='+t);
  if(s===t){ await visualizer.visitNode(graph.at(i),'path'); await visualizer.visitNode(graph.at(j),'path'); await visualizer.log('Par encontrado: '+a[i]+' + '+a[j]); return; }
  await visualizer.visitNode(graph.at(i),'visited');
  await visualizer.visitNode(graph.at(j),'visited');
  if(s<t) i++; else j--;
}
await visualizer.log('No existe par con esa suma');`,

'Arreglo: sliding window (suma máxima)':`const n=graph.len, k=Math.max(1,Math.min(n,Number(params.val)||3)), a=[];
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
let s=0; for(let i=0;i<k;i++) s+=a[i];
let best=s, bi=0;
for(let i=0;i<k;i++) await visualizer.visitNode(graph.at(i),'queued');
await visualizer.log('Ventana inicial, suma='+s);
for(let i=k;i<n;i++){
  s+=a[i]-a[i-k];
  await visualizer.visitNode(graph.at(i-k),'visited');
  await visualizer.visitNode(graph.at(i),'queued');
  await visualizer.log('Ventana ['+(i-k+1)+'..'+i+'] suma='+s);
  if(s>best){ best=s; bi=i-k+1; }
}
for(let i=bi;i<bi+k;i++) await visualizer.visitNode(graph.at(i),'path');
await visualizer.log('Máxima suma='+best+' en la ventana desde el índice '+bi);`,

'Pila: siguiente mayor (monotónica)':`const n=graph.len, ids=[], vals=[];
for(let i=n-1;i>=0;i--){ ids.push(graph.at(i)); vals.push(Number(graph.val(graph.at(i)))); }
const res=Array(n).fill(null), st=[];
for(let i=0;i<n;i++){
  await visualizer.visitNode(ids[i],'current');
  while(st.length && vals[st[st.length-1]]<vals[i]){
    const j=st.pop(); res[j]=vals[i];
    await visualizer.log('Siguiente mayor de '+vals[j]+' es '+vals[i]);
    await visualizer.visitNode(ids[j],'visited');
  }
  st.push(i);
  await visualizer.visitNode(ids[i],'queued');
  await visualizer.setStructure('Pila (índices)',st.map(k=>vals[k]));
}
await visualizer.setStructure('Siguiente mayor',vals.map((v,i)=>v+' → '+(res[i]===null?'-':res[i])));
await visualizer.log('Monotónica terminada');`,

'Pila: infija a postfija':`const expr=String(params.val||'').trim();
if(!expr){ await visualizer.log('Escribe una expresión en el campo valor, por ejemplo 3+4*2'); return; }
const tok=expr.match(/\\d+(\\.\\d+)?|[A-Za-z]\\w*|[()+\\-*\\/^]/g)||[];
const P={'+':1,'-':1,'*':2,'/':2,'^':3}, out=[], st=[];
for(const t of tok){
  if(/^[\\w.]/.test(t)) out.push(t);
  else if(t==='(') st.push(t);
  else if(t===')'){ while(st.length && st[st.length-1]!=='(') out.push(st.pop()); st.pop(); }
  else {
    while(st.length){
      const top=st[st.length-1];
      if(top==='(' || P[top]<P[t] || (P[top]===P[t] && t==='^')) break;
      out.push(st.pop());
    }
    st.push(t);
  }
  await visualizer.log('token '+t+' → salida: '+out.join(' ')+' | pila: '+st.join(' '));
  await visualizer.setStructure('Pila',[...st]);
  await visualizer.setStructure('Salida',[...out]);
}
while(st.length) out.push(st.pop());
await visualizer.setStructure('Pila',[]);
await visualizer.setStructure('Salida',[...out]);
await visualizer.log('Postfija: '+out.join(' '));`,

'Pila: evaluar postfija':`const tok=String(params.val||'').trim().split(/\\s+/).filter(Boolean);
if(!tok.length){ await visualizer.log('Escribe una expresión postfija separada por espacios, por ejemplo: 3 4 + 2 *'); return; }
const OPS={'+':(a,b)=>a+b,'-':(a,b)=>a-b,'*':(a,b)=>a*b,'/':(a,b)=>a/b,'^':(a,b)=>a**b};
const st=[];
for(const t of tok){
  if(/^-?\\d+(\\.\\d+)?$/.test(t)) st.push(+t);
  else {
    if(!OPS[t]){ await visualizer.log('Símbolo desconocido: '+t); return; }
    if(st.length<2){ await visualizer.log('Faltan operandos para '+t); return; }
    const b=st.pop(), a=st.pop(), r=OPS[t](a,b);
    st.push(r);
    await visualizer.log(a+' '+t+' '+b+' = '+r);
  }
  await visualizer.setStructure('Pila',[...st]);
}
await visualizer.log('Resultado: '+st[st.length-1]);`,

'Cola: ventana máxima (deque)':`const n=graph.len, k=Math.max(1,Math.min(n,Number(params.val)||3)), a=[];
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
const dq=[], res=[];
for(let i=0;i<n;i++){
  await visualizer.visitNode(graph.at(i),'current');
  while(dq.length && dq[0]<=i-k) dq.shift();
  while(dq.length && a[dq[dq.length-1]]<=a[i]) dq.pop();
  dq.push(i);
  await visualizer.setStructure('Deque (índices)',[...dq]);
  if(i>=k-1){ res.push(a[dq[0]]); await visualizer.log('Ventana '+(i-k+1)+'..'+i+' máximo '+a[dq[0]]); }
  await visualizer.visitNode(graph.at(i),'visited');
}
await visualizer.setStructure('Máximos por ventana',res);`,

'Lista: invertir punteros':`let prev=undefined, cur=graph.head(), seq=[];
const seen=new Set();
while(cur!==undefined && !seen.has(cur)){
  seen.add(cur);
  const nx=graph.succ(cur);
  await visualizer.visitNode(cur,'current');
  await visualizer.log('Invertir puntero de '+graph.val(cur)+' → '+(prev!==undefined?graph.val(prev):'null'));
  await visualizer.visitNode(cur,'visited');
  seq.push(graph.val(cur));
  prev=cur; cur=nx;
}
await visualizer.setStructure('Lista invertida (cabeza → cola)',seq.slice().reverse());
await visualizer.log('Nueva cabeza: '+(prev!==undefined?graph.val(prev):'null'));`,

'Heap: heapify':`const n=graph.len, a=[], max=!!params.max;
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
const bef=(x,y)=>max?x>y:x<y;
async function down(i,end){
  for(;;){
    const l=2*i+1, r=2*i+2; let b=i;
    if(l<end && bef(a[l],a[b])) b=l;
    if(r<end && bef(a[r],a[b])) b=r;
    await visualizer.visitNode(graph.at(i),'current');
    if(b===i){ await visualizer.visitNode(graph.at(i),'visited'); break; }
    await visualizer.log('Intercambio '+a[i]+' ↔ '+a[b]);
    [a[i],a[b]]=[a[b],a[i]];
    await visualizer.setStructure('Arreglo',[...a]);
    await visualizer.visitNode(graph.at(b),'queued');
    await visualizer.visitNode(graph.at(i),'visited');
    i=b;
  }
}
await visualizer.setStructure('Arreglo',[...a]);
for(let i=Math.floor(n/2)-1;i>=0;i--){ await visualizer.log('sift-down desde índice '+i); await down(i,n); }
await visualizer.setStructure('Arreglo',[...a]);
await visualizer.log('Heap construido');`,

'Heap: sift-up (último)':`const n=graph.len, a=[], max=!!params.max;
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
const bef=(x,y)=>max?x>y:x<y;
let i=n-1;
while(i>0){
  const p=(i-1)>>1;
  await visualizer.visitNode(graph.at(i),'current');
  if(!bef(a[i],a[p])){ await visualizer.log('Ya cumple la propiedad de heap'); break; }
  await visualizer.log('Subir '+a[i]+' sobre '+a[p]);
  [a[i],a[p]]=[a[p],a[i]];
  await visualizer.setStructure('Arreglo',[...a]);
  await visualizer.visitNode(graph.at(p),'queued');
  await visualizer.visitNode(graph.at(i),'visited');
  i=p;
}
await visualizer.setStructure('Arreglo',[...a]);
await visualizer.log('sift-up terminado');`,

'Heap: sift-down (raíz)':`const n=graph.len, a=[], max=!!params.max;
for(let i=0;i<n;i++) a.push(Number(graph.val(graph.at(i))));
const bef=(x,y)=>max?x>y:x<y;
let i=0;
await visualizer.setStructure('Arreglo',[...a]);
for(;;){
  const l=2*i+1, r=2*i+2; let b=i;
  if(l<n && bef(a[l],a[b])) b=l;
  if(r<n && bef(a[r],a[b])) b=r;
  await visualizer.visitNode(graph.at(i),'current');
  if(b===i){ await visualizer.visitNode(graph.at(i),'visited'); await visualizer.log('Propiedad restablecida'); break; }
  await visualizer.log('Bajar '+a[i]+' intercambiando con '+a[b]);
  [a[i],a[b]]=[a[b],a[i]];
  await visualizer.setStructure('Arreglo',[...a]);
  await visualizer.visitNode(graph.at(b),'queued');
  await visualizer.visitNode(graph.at(i),'visited');
  i=b;
}
await visualizer.setStructure('Arreglo',[...a]);`,

'Bellman-Ford':`const {start}=params, d={};
for(const n of graph.nodes) d[n]=Infinity;
d[start]=0;
const E=[...graph.edges];
if(!graph.directed) for(const e of graph.edges) E.push({from:e.to,to:e.from,weight:e.weight});
for(let it=1;it<graph.nodes.length;it++){
  let ch=false;
  for(const e of E){
    if(d[e.from]<Infinity && d[e.from]+e.weight<d[e.to]){
      d[e.to]=d[e.from]+e.weight; ch=true;
      await visualizer.highlightEdge(e.from,e.to,'queued');
      await visualizer.visitNode(e.to,'queued');
      await visualizer.log('Iteración '+it+': d['+e.to+']='+d[e.to]);
    }
  }
  await visualizer.setStructure('dist',{...d});
  if(!ch){ await visualizer.log('Sin cambios: convergió'); break; }
}
for(const e of E) if(d[e.from]<Infinity && d[e.from]+e.weight<d[e.to]){ await visualizer.log('⚠ Ciclo negativo alcanzable desde '+start); return; }
await visualizer.log('Distancias: '+Object.entries(d).map(([k,v])=>k+'='+v).join(', '));`,

'Floyd-Warshall':`const N=graph.nodes, idx={}; N.forEach((n,i)=>idx[n]=i);
const D=N.map((_,i)=>N.map((_,j)=>i===j?0:Infinity));
for(const e of graph.edges){
  const i=idx[e.from], j=idx[e.to];
  D[i][j]=Math.min(D[i][j],e.weight);
  if(!graph.directed) D[j][i]=Math.min(D[j][i],e.weight);
}
for(let k=0;k<N.length;k++){
  await visualizer.visitNode(N[k],'current');
  for(let i=0;i<N.length;i++) for(let j=0;j<N.length;j++){
    if(D[i][k]+D[k][j]<D[i][j]) D[i][j]=D[i][k]+D[k][j];
  }
  await visualizer.log('Intermedio '+N[k]+' considerado');
  await visualizer.setStructure('D tras k='+N[k],D.map(r=>r.map(x=>x===Infinity?'∞':x)));
  await visualizer.visitNode(N[k],'visited');
}
if(D.some((r,i)=>r[i]<0)) await visualizer.log('⚠ Hay ciclo negativo');
else await visualizer.log('Matriz de distancias final calculada');`,

'Topológico (Kahn)':`if(!graph.directed){ await visualizer.log('El ordenamiento topológico requiere un grafo dirigido'); return; }
const indeg={};
for(const n of graph.nodes) indeg[n]=0;
for(const e of graph.edges) indeg[e.to]++;
const q=graph.nodes.filter(n=>indeg[n]===0), order=[];
for(const n of q) await visualizer.visitNode(n,'queued');
while(q.length){
  const u=q.shift();
  await visualizer.visitNode(u,'current');
  order.push(u);
  await visualizer.log('Procesar '+u);
  for(const {to} of graph.neighbors(u)){
    indeg[to]--;
    if(indeg[to]===0){ q.push(to); await visualizer.visitNode(to,'queued'); }
  }
  await visualizer.visitNode(u,'visited');
  await visualizer.setStructure('Orden',[...order]);
}
if(order.length<graph.nodes.length) await visualizer.log('⚠ Hay un ciclo: no existe orden topológico');
else await visualizer.log('Orden: '+order.join(' → '));`
});

Object.assign(GROUPS,{
 array:['Arreglo: búsqueda binaria','Arreglo: two pointers (suma objetivo)','Arreglo: sliding window (suma máxima)'],
 stack:['Pila: siguiente mayor (monotónica)','Pila: infija a postfija','Pila: evaluar postfija'],
 queue:['Cola: ventana máxima (deque)'],
 deque:['Cola: ventana máxima (deque)'],
 pq:['Cola: ventana máxima (deque)'],
 dlist:['Lista: recorrer','Lista: buscar','Lista: invertir punteros','Lista: detectar ciclo'],
 clist:['Lista: recorrer','Lista: invertir punteros','Lista: detectar ciclo'],
 heap:['Heap: heapify','Heap: sift-up (último)','Heap: sift-down (raíz)'],
 heapmax:['Heap: heapify','Heap: sift-up (último)','Heap: sift-down (raíz)']
});
GROUPS.list.push('Lista: invertir punteros');
GROUPS.graph.push('Bellman-Ford','Floyd-Warshall','Topológico (Kahn)');
