/* ============ Algoritmos de árboles y tablas hash (se ejecutan en el Worker) ============ */
// Los eventos de TREE_LIB se reproducen con visitNode/log. Las rotaciones y divisiones se muestran; el grafo se actualiza con la operación Insertar/Eliminar.
const ANIM_IDS=`const idOf={};
const mp=n=>{if(!n)return;idOf[String(n.v)]=n.id;mp(n.l);mp(n.r)};mp(params.model);
const hl=async(lab,st)=>{if(idOf[lab]!==undefined)await visualizer.visitNode(idOf[lab],st)};
const io=n=>n?[...io(n.l),n.v,...io(n.r)]:[];
`;
const ANIM_EV=`for(const e of EVS){
  if(e.t==='visit'){ await hl(e.lab,'current'); await visualizer.log('Visitar '+e.lab); }
  else if(e.t==='rot'){ await hl(e.lab,'path'); await visualizer.log('Rotación/caso '+e.k+' en '+e.lab); }
  else if(e.t==='new'){ await visualizer.log('Nuevo nodo '+e.lab); }
}
`;
Object.assign(ALGS,{
'AVL: insertar (rotaciones)': ANIM_IDS + `const R=avlInsert(params.model,Number(params.val)); const EVS=R.ev;\n` + ANIM_EV +
`await visualizer.setStructure('Inorden',io(R.root));
await visualizer.log('Altura de la raíz: '+R.root.h);`,

'RB: insertar (recoloreo y rotaciones)': ANIM_IDS + `const R=rbInsert(params.model,Number(params.val)); const EVS=R.ev;\n` + ANIM_EV +
`await visualizer.setStructure('Inorden',io(R.root));
await visualizer.log('Raíz negra. Propiedades verificadas al final de la inserción');`,

'AVL: buscar': `let n=params.model; const v=Number(params.val);
while(n){
  await visualizer.visitNode(n.id,'current');
  await visualizer.log('Comparar '+v+' con '+n.v);
  if(n.v===v){ await visualizer.visitNode(n.id,'path'); await visualizer.log('Encontrado'); return; }
  await visualizer.visitNode(n.id,'visited');
  n = v<n.v ? n.l : n.r;
}
await visualizer.log('No encontrado');`,

'RB: buscar': `let n=params.model; const v=Number(params.val);
while(n){
  await visualizer.visitNode(n.id,'current');
  await visualizer.log('Comparar '+v+' con '+n.v+(n.c?' ('+n.c+')':''));
  if(n.v===v){ await visualizer.visitNode(n.id,'path'); await visualizer.log('Encontrado'); return; }
  await visualizer.visitNode(n.id,'visited');
  n = v<n.v ? n.l : n.r;
}
await visualizer.log('No encontrado');`,

'B: buscar': `const v=Number(params.val); let n=params.model;
while(n){
  await visualizer.visitNode(n.id,'current');
  await visualizer.log('Nodo ['+n.keys.join(' | ')+']');
  if(n.keys.indexOf(v)>=0){ await visualizer.visitNode(n.id,'path'); await visualizer.log('Encontrado '+v); return; }
  if(!n.kids.length) break;
  let j=0; while(j<n.keys.length && v>n.keys[j]) j++;
  await visualizer.log('Bajar al hijo '+j);
  await visualizer.visitNode(n.id,'visited');
  n=n.kids[j];
}
await visualizer.log('No encontrado');`,

'B+: buscar': `const v=Number(params.val); let n=params.model;
while(n){
  await visualizer.visitNode(n.id,'current');
  await visualizer.log((n.kids.length?'Índice ':'Hoja ')+'['+n.keys.join(' | ')+']');
  if(!n.kids.length){
    if(n.keys.indexOf(v)>=0){ await visualizer.visitNode(n.id,'path'); await visualizer.log('Encontrado '+v+' en la hoja'); return; }
    break;
  }
  let j=0; while(j<n.keys.length && v>=n.keys[j]) j++;
  await visualizer.log('Bajar al hijo '+j+' (separadores ≤ '+v+')');
  await visualizer.visitNode(n.id,'visited');
  n=n.kids[j];
}
await visualizer.log('No encontrado');`,

'B+: recorrer hojas': `const hojas=[]; const go=n=>{ if(!n.kids.length) hojas.push(n); else n.kids.forEach(go); }; go(params.model);
for(const h of hojas){
  await visualizer.visitNode(h.id,'current');
  await visualizer.log('Hoja ['+h.keys.join(' | ')+'] → siguiente hoja por enlace');
  await visualizer.visitNode(h.id,'visited');
}
await visualizer.setStructure('Claves en orden',hojas.map(h=>h.keys.join(' ')));`,

'Trie: buscar prefijo': `let n=params.model; const w=String(params.val||'').toLowerCase();
if(!w){ await visualizer.log('Escribe un prefijo en el campo valor'); return; }
for(const c of w){
  await visualizer.visitNode(n.id,'visited');
  if(!n.kids[c]){ await visualizer.log('No existe el prefijo "'+w+'": falta la letra '+c); return; }
  n=n.kids[c];
  await visualizer.visitNode(n.id,'current');
  await visualizer.log('Avanzar por '+c);
}
await visualizer.visitNode(n.id,'path');
await visualizer.log(n.end?'Palabra completa: "'+w+'"':'El prefijo "'+w+'" existe, pero no es palabra completa');`,

'Hash: función hash (división)': `const m=params.model, filas=[];
if(m.b){ m.b.forEach((bk,i)=>bk.forEach(k=>filas.push([k,i]))); }
else { m.s.forEach((k,i)=>{ if(k!==null) filas.push([k,((k%7)+7)%7]); }); }
for(const [k,h] of filas){
  await visualizer.log('h('+k+') = '+k+' mod 7 = '+h);
}
await visualizer.log('Función: h(k) = k mod 7 (método de la división)');`,

'Hash: buscar (encadenamiento)': `const m=params.model, k=Number(params.val), h=((k%7)+7)%7;
await visualizer.visitNode('h'+h,'current');
await visualizer.log('Bucket '+h+' para la clave '+k);
const cadena=m.b[h];
for(let j=0;j<cadena.length;j++){
  await visualizer.visitNode('c'+h+'_'+j,'current');
  await visualizer.log('Comparar con '+cadena[j]);
  if(cadena[j]===k){ await visualizer.visitNode('c'+h+'_'+j,'path'); await visualizer.log('Encontrado en la cadena'); return; }
}
await visualizer.log('No encontrado (la cadena no contiene la clave)');`,

'Hash: insertar (sondeo lineal)': `const m=params.model, k=Number(params.val), h=((k%7)+7)%7;
await visualizer.log('h('+k+') = '+h);
for(let p=0;p<7;p++){
  const idx=(h+p)%7;
  await visualizer.visitNode('s'+idx,'current');
  if(m.s[idx]===null){ await visualizer.visitNode('s'+idx,'path'); await visualizer.log('Slot '+idx+' libre: se inserta allí'); return; }
  await visualizer.log('Sondeo '+p+': slot '+idx+' ocupado por '+m.s[idx]);
  await visualizer.visitNode('s'+idx,'visited');
}
await visualizer.log('Tabla llena');`,

'Hash: buscar (sondeo lineal)': `const m=params.model, k=Number(params.val), h=((k%7)+7)%7;
for(let p=0;p<7;p++){
  const idx=(h+p)%7;
  await visualizer.visitNode('s'+idx,'current');
  await visualizer.log('Sondeo '+p+': slot '+idx+' = '+(m.s[idx]===null?'vacío':m.s[idx]));
  if(m.s[idx]===k){ await visualizer.visitNode('s'+idx,'path'); await visualizer.log('Encontrado'); return; }
  if(m.s[idx]===null) break;
  await visualizer.visitNode('s'+idx,'visited');
}
await visualizer.log('No encontrado');`
});
