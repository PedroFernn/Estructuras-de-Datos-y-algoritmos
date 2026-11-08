Object.assign(ALGS,{
'Lista: recorrer':`if(!params.start){ await visualizer.log('Lista vacía'); return; }
let cur=params.start; const seen=new Set();
while(cur!==undefined){
  if(seen.has(cur)){ await visualizer.log('Ciclo: ya visité '+cur); break; }
  seen.add(cur);
  await visualizer.visitNode(cur,'current');
  await visualizer.log('Visitar '+cur);
  await visualizer.visitNode(cur,'visited');
  const nx=graph.neighbors(cur)[0]; cur=nx&&nx.to;
}
await visualizer.log('Fin (null)');`,
'Lista: buscar':`let cur=params.start, i=0;
while(cur!==undefined && i<=graph.nodes.length){
  await visualizer.visitNode(cur,'current');
  await visualizer.log('Comparar '+cur+' con '+params.end+' (posición '+i+')');
  if(cur===params.end){ await visualizer.visitNode(cur,'path'); await visualizer.log('Encontrado en posición '+i); return; }
  await visualizer.visitNode(cur,'visited');
  const nx=graph.neighbors(cur)[0]; cur=nx&&nx.to; i++;
}
await visualizer.log('No encontrado');`,
'Lista: nodo medio':`const nx=id=>{const n=graph.neighbors(id)[0];return n&&n.to};
let slow=params.start, fast=params.start, k=0;
while(fast!==undefined && nx(fast)!==undefined && k++<graph.nodes.length){
  await visualizer.visitNode(slow,'visited');
  slow=nx(slow); fast=nx(nx(fast));
  await visualizer.visitNode(slow,'current');
  await visualizer.setStructure('lento / rápido',[slow,fast===undefined?'null':fast]);
  await visualizer.log('lento avanza 1, rápido avanza 2');
}
await visualizer.visitNode(slow,'path');
await visualizer.log('Nodo medio: '+slow);`,
'Lista: detectar ciclo':`// Floyd (tortuga y liebre)
const nx=id=>{const n=graph.neighbors(id)[0];return n&&n.to};
let t=params.start, h=params.start;
while(h!==undefined && nx(h)!==undefined){
  t=nx(t); h=nx(nx(h));
  await visualizer.visitNode(t,'current');
  if(h!==undefined) await visualizer.visitNode(h,'queued');
  await visualizer.log('tortuga='+t+' liebre='+h);
  if(t===h){ await visualizer.visitNode(t,'path'); await visualizer.log('¡Ciclo detectado en '+t+'!'); return; }
}
await visualizer.log('Sin ciclo: la liebre llegó a null');`,
});
