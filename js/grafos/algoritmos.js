/* ============ Algoritmos predeterminados (editables) ============ */
const ALGS={
BFS:`const q=[params.start], seen=new Set(q);
await visualizer.visitNode(params.start,'queued');
await visualizer.setStructure('Cola',q);
while(q.length){
  const u=q.shift();
  await visualizer.visitNode(u,'current');
  await visualizer.log('Sacar '+u+' de la cola');
  for(const {to} of graph.neighbors(u)){
    if(seen.has(to)) continue;
    seen.add(to); q.push(to);
    await visualizer.highlightEdge(u,to,'queued');
    await visualizer.visitNode(to,'queued');
  }
  await visualizer.visitNode(u,'visited');
  await visualizer.setStructure('Cola',q);
}
await visualizer.log('BFS terminado');`,
DFS:`const seen=new Set(), st=[];
async function dfs(u){
  seen.add(u); st.push(u);
  await visualizer.visitNode(u,'current');
  await visualizer.setStructure('Pila (recursión)',st);
  await visualizer.log('Visitar '+u);
  for(const {to} of graph.neighbors(u)) if(!seen.has(to)){
    await visualizer.highlightEdge(u,to,'current');
    await dfs(to);
    await visualizer.highlightEdge(u,to,'visited');
  }
  await visualizer.visitNode(u,'visited'); st.pop();
  await visualizer.setStructure('Pila (recursión)',st);
}
await dfs(params.start);
await visualizer.log('DFS terminado');`,
Dijkstra:`const {start,end}=params, dist={}, prev={}, done=new Set();
for(const n of graph.nodes) dist[n]=Infinity;
dist[start]=0; const pq=[[0,start]];
await visualizer.visitNode(start,'queued');
await visualizer.setStructure('dist',dist);
while(pq.length){
  pq.sort((a,b)=>a[0]-b[0]);
  const [d,u]=pq.shift();
  if(done.has(u)) continue;
  done.add(u);
  await visualizer.visitNode(u,'current');
  await visualizer.log('Extraer '+u+' (d='+d+')');
  if(u===end) break;
  for(const {to,weight} of graph.neighbors(u)){
    if(done.has(to)||d+weight>=dist[to]) continue;
    dist[to]=d+weight; prev[to]=u; pq.push([dist[to],to]);
    await visualizer.highlightEdge(u,to,'queued');
    await visualizer.visitNode(to,'queued');
    await visualizer.log('Relajar '+u+'→'+to+': dist='+dist[to]);
  }
  await visualizer.visitNode(u,'visited');
  await visualizer.setStructure('dist',dist);
  await visualizer.setStructure('Cola prioridad',pq.map(x=>x[1]+':'+x[0]));
}
if(end && dist[end]<Infinity){
  const path=[end]; while(prev[path[0]]!==undefined) path.unshift(prev[path[0]]);
  await visualizer.showPath(path);
  await visualizer.log('Camino: '+path.join(' → ')+' (costo '+dist[end]+')');
}`,
'A*':`const {start,end}=params;
if(!end || end===start){ await visualizer.log('Elige un destino distinto del inicio'); return; }
const g={},f={},prev={},open=[start],closed=new Set();
for(const n of graph.nodes) g[n]=Infinity;
g[start]=0; f[start]=graph.h(start,end);
await visualizer.visitNode(start,'queued');
while(open.length){
  open.sort((a,b)=>f[a]-f[b]);
  const u=open.shift();
  await visualizer.visitNode(u,'current');
  await visualizer.log('Expandir '+u+' (f='+f[u].toFixed(1)+')');
  if(u===end){
    const path=[u]; while(prev[path[0]]!==undefined) path.unshift(prev[path[0]]);
    await visualizer.showPath(path);
    await visualizer.log('Camino: '+path.join(' → ')+' (costo '+g[u]+')'); return;
  }
  closed.add(u);
  for(const {to,weight} of graph.neighbors(u)){
    if(closed.has(to)) continue;
    const t=g[u]+weight;
    if(t<g[to]){
      g[to]=t; prev[to]=u; f[to]=t+graph.h(to,end);
      if(!open.includes(to)) open.push(to);
      await visualizer.highlightEdge(u,to,'queued');
      await visualizer.visitNode(to,'queued');
    }
  }
  await visualizer.visitNode(u,'visited');
  await visualizer.setStructure('Abiertos (f)',open.map(n=>n+':'+f[n].toFixed(1)));
}
await visualizer.log('Sin camino');`,
Prim:`// Trata el grafo como no dirigido
const inT=new Set([params.start]); let total=0;
await visualizer.visitNode(params.start,'visited');
while(true){
  let best=null;
  for(const e of graph.edges){
    if(inT.has(e.from)!==inT.has(e.to) && (!best||e.weight<best.weight)) best=e;
  }
  if(!best) break;
  const v=inT.has(best.from)?best.to:best.from;
  inT.add(v); total+=best.weight;
  await visualizer.highlightEdge(best.from,best.to,'path');
  await visualizer.visitNode(v,'visited');
  await visualizer.setStructure('Árbol',[...inT]);
  await visualizer.log('Añadir '+best.from+'-'+best.to+' (w='+best.weight+')');
}
await visualizer.log('Peso total MST: '+total);`,
Kruskal:`// Trata el grafo como no dirigido
const p={}; for(const n of graph.nodes) p[n]=n;
const find=x=>p[x]===x?x:(p[x]=find(p[x]));
const E=[...graph.edges].sort((a,b)=>a.weight-b.weight); let total=0;
await visualizer.setStructure('Aristas ordenadas',E.map(e=>e.from+'-'+e.to+':'+e.weight));
for(const e of E){
  await visualizer.highlightEdge(e.from,e.to,'current');
  const a=find(e.from), b=find(e.to);
  if(a!==b){
    p[a]=b; total+=e.weight;
    await visualizer.highlightEdge(e.from,e.to,'path');
    await visualizer.visitNode(e.from,'visited'); await visualizer.visitNode(e.to,'visited');
    await visualizer.log('Aceptada '+e.from+'-'+e.to+' (w='+e.weight+')');
  } else {
    await visualizer.highlightEdge(e.from,e.to,'unvisited');
    await visualizer.log('Descartada '+e.from+'-'+e.to+' (forma ciclo)');
  }
}
await visualizer.log('Peso total MST: '+total);`};
