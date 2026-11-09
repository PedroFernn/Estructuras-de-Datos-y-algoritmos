Object.assign(ALGS,{
'Preorden':`const out=[];
async function go(u){
  if(u===undefined) return;
  await visualizer.visitNode(u,'current'); out.push(u);
  await visualizer.setStructure('Salida',out); await visualizer.log('Visitar '+graph.val(u)+' (raíz, izq, der)');
  await visualizer.visitNode(u,'visited');
  await go(graph.left(u)); await go(graph.right(u));
}
await go(params.start);`,
'Inorden':`const out=[];
async function go(u){
  if(u===undefined) return;
  await visualizer.visitNode(u,'queued');
  await go(graph.left(u));
  await visualizer.visitNode(u,'current'); out.push(u);
  await visualizer.setStructure('Salida',out); await visualizer.log('Visitar '+graph.val(u)+' (izq, raíz, der)');
  await visualizer.visitNode(u,'visited');
  await go(graph.right(u));
}
await go(params.start);`,
'Postorden':`const out=[];
async function go(u){
  if(u===undefined) return;
  await visualizer.visitNode(u,'queued');
  await go(graph.left(u)); await go(graph.right(u));
  await visualizer.visitNode(u,'current'); out.push(u);
  await visualizer.setStructure('Salida',out); await visualizer.log('Visitar '+graph.val(u)+' (izq, der, raíz)');
  await visualizer.visitNode(u,'visited');
}
await go(params.start);`,
'Por niveles':`const q=[params.start], out=[];
while(q.length){
  const u=q.shift();
  await visualizer.visitNode(u,'current'); out.push(u);
  await visualizer.log('Visitar '+graph.val(u));
  for(const c of [graph.left(u),graph.right(u)]) if(c!==undefined){
    q.push(c); await visualizer.highlightEdge(u,c,'queued'); await visualizer.visitNode(c,'queued');
  }
  await visualizer.visitNode(u,'visited');
  await visualizer.setStructure('Cola',q); await visualizer.setStructure('Salida',out);
}`,
'BST: buscar':`let u=params.start; const t=+params.end;
while(u!==undefined){
  await visualizer.visitNode(u,'current');
  await visualizer.log('Comparar '+t+' con '+u);
  if(+u===t){ await visualizer.visitNode(u,'path'); await visualizer.log('Encontrado'); return; }
  const nx=t<+u?graph.left(u):graph.right(u);
  await visualizer.log(t<+u?'Menor: ir a la izquierda':'Mayor: ir a la derecha');
  await visualizer.visitNode(u,'visited');
  if(nx!==undefined) await visualizer.highlightEdge(u,nx,'current');
  u=nx;
}
await visualizer.log('No encontrado');`,
'Altura':`async function h(u){
  if(u===undefined) return 0;
  await visualizer.visitNode(u,'current');
  const a=await h(graph.left(u)), b=await h(graph.right(u)), r=1+Math.max(a,b);
  await visualizer.visitNode(u,'visited');
  await visualizer.log('altura('+graph.val(u)+') = '+r);
  return r;
}
await visualizer.log('Altura del árbol (en nodos): '+await h(params.start));`,
'Validar BST':`async function ok(u,lo,hi){
  if(u===undefined) return true;
  await visualizer.visitNode(u,'current');
  const v=+u;
  if(!(v>lo && v<hi)){ await visualizer.visitNode(u,'path'); await visualizer.log('✗ '+graph.val(u)+' viola el rango ('+lo+', '+hi+')'); return false; }
  const r=(await ok(graph.left(u),lo,v)) && (await ok(graph.right(u),v,hi));
  await visualizer.visitNode(u,'visited'); return r;
}
await visualizer.log((await ok(params.start,-Infinity,Infinity))?'Es un BST válido':'NO es un BST');`});
