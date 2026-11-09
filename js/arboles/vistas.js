/* ============ Vistas de árboles y tablas hash: modelo → grafo ============ */
// VM[k] guarda el modelo de cada estructura. Cada operación produce un modelo nuevo y se reconstruye el grafo.
const TL=new Function(TREE_LIB+';return {binInsert,avlInsert,avlDelete,rbInsert,bInsert,bpInsert,trieInsert};')();
COLORS['rb-R']='#dc2626';COLORS['rb-B']='#111827';COLORS['mark']='#14b8a6';
const HS=7;
const hk=k=>((k%HS)+HS)%HS;
let VID=0;
const VM={};

// Recorre un modelo y crea nodos y aristas del grafo. kidsOf(n) -> [{n, kind}].
function gTree(root,labelOf,kidsOf,colorOf){
 if(!root)return;
 const go=n=>{n.id='n'+(++VID);G.nodes.push({id:n.id,label:labelOf(n),x:0,y:0,color:colorOf?colorOf(n):undefined});kidsOf(n).forEach(k=>go(k.n))};
 go(root);
 const edges=n=>kidsOf(n).forEach(k=>{G.edges.push({u:n.id,v:k.n.id,w:1,kind:k.kind});edges(k.n)});
 edges(root);
}
const kidsBin=n=>[n.l&&{n:n.l,kind:'left'},n.r&&{n:n.r,kind:'right'}].filter(Boolean);
const kidsB=n=>n.kids.map(c=>({n:c,kind:'child'}));
const kidsTrie=n=>Object.keys(n.kids).sort().map(c=>({n:n.kids[c],kind:'child'}));
function leavesOf(n,out){if(!n.kids.length)out.push(n);else n.kids.forEach(c=>leavesOf(c,out));return out}

function buildBin(m){gTree(m,n=>String(n.v),kidsBin,n=>n.c?'rb-'+n.c:undefined)}
function buildB(m){gTree(m,n=>n.keys.join('|'),kidsB,null)}
function buildBPlus(m){
 gTree(m,n=>n.keys.join('|'),kidsB,null);
 if(!m)return;
 const lv=leavesOf(m,[]);
 for(let i=0;i+1<lv.length;i++)G.edges.push({u:lv[i].id,v:lv[i+1].id,w:1,kind:'link'});
}
function buildTrie(m){gTree(m,n=>n.ch||'·',kidsTrie,n=>n.end?'mark':undefined)}
function buildHashCh(m){
 for(let i=0;i<HS;i++){
  G.nodes.push({id:'h'+i,label:String(i),x:0,y:0,role:'hdr',row:i,col:0});
  m.b[i].forEach((k,j)=>G.nodes.push({id:'c'+i+'_'+j,label:String(k),x:0,y:0,row:i,col:j+1}));
 }
 for(let i=0;i<HS;i++){
  if(m.b[i].length)G.edges.push({u:'h'+i,v:'c'+i+'_0',w:1,kind:'child'});
  for(let j=0;j+1<m.b[i].length;j++)G.edges.push({u:'c'+i+'_'+j,v:'c'+i+'_'+(j+1),w:1,kind:'next'});
 }
}
function buildHashOpen(m){
 m.s.forEach((v,i)=>G.nodes.push({id:'s'+i,label:i+':'+(v===null?'—':v),x:0,y:0,role:'slot',row:i,col:0}));
}
function hashCh(m,k){const i=hk(k);if(!m.b[i].includes(k))m.b[i].push(k);return m}
function hashOpen(m,k){
 if(m.s.includes(k))return m;
 const h=hk(k);
 for(let p=0;p<HS;p++){const idx=(h+p)%HS;if(m.s[idx]===null){m.s[idx]=k;return m}}
 msg('Tabla llena');return m;
}

// ---- Layouts: leen el grafo ya construido y asignan posiciones ----
function layInorder(W,H){
 const hasIn=new Set(G.edges.map(e=>e.v));
 const roots=G.nodes.filter(n=>!hasIn.has(n.id));
 const edge=(u,kind)=>{const e=G.edges.find(e=>e.u===u&&e.kind===kind);return e&&e.v};
 const pos={};let c=0,maxD=0;
 const go=(id,d)=>{if(!id)return;go(edge(id,'left'),d+1);pos[id]={x:c++,d:d};maxD=Math.max(maxD,d);go(edge(id,'right'),d+1)};
 roots.forEach(r=>go(r.id,0));
 const xs=Math.min(60,(W-80)/Math.max(c-1,1)),dy=Math.min(90,(H-100)/Math.max(maxD,1));
 G.nodes.forEach(n=>{const p=pos[n.id];if(p){n.x=40+p.x*xs;n.y=50+p.d*dy}});
}
function layTidy(W,H){
 const kids=id=>G.edges.filter(e=>e.u===id&&e.kind==='child').map(e=>e.v);
 const hasIn=new Set(G.edges.filter(e=>e.kind==='child').map(e=>e.v));
 const roots=G.nodes.filter(n=>!hasIn.has(n.id));
 const X={},D={};let leaves=0,maxD=0;
 const go=(id,d)=>{D[id]=d;maxD=Math.max(maxD,d);const ks=kids(id);
  if(!ks.length)X[id]=leaves++;else{ks.forEach(k=>go(k,d+1));X[id]=(X[ks[0]]+X[ks[ks.length-1]])/2}};
 roots.forEach(r=>go(r.id,0));
 const xs=Math.min(70,(W-80)/Math.max(leaves-1,1)),dy=Math.min(80,(H-100)/Math.max(maxD,1));
 G.nodes.forEach(n=>{if(X[n.id]!==undefined){n.x=40+X[n.id]*xs;n.y=50+D[n.id]*dy}});
}
function layHashCh(W,H){
 const rowH=Math.min(70,(H-80)/HS);
 G.nodes.forEach(n=>{n.x=n.role==='hdr'?40:130+(n.col-1)*56;n.y=50+n.row*rowH});
}
function layHashOpen(W,H){
 const xs=Math.min(70,(W-80)/HS);
 G.nodes.forEach(n=>{n.x=40+n.row*xs;n.y=H/2});
}
const VLAY={inorder:layInorder,tidy:layTidy,hashch:layHashCh,hashopen:layHashOpen};

// ---- Definición de cada estructura ----
const VIEWS={
 bin:{num:true,lay:'inorder',build:buildBin,empty:()=>null,sample:[50,30,70,20,40,60,80],
  alg:['Preorden','Inorden','Postorden','Por niveles','Altura'],
  ops:{'Insertar':(m,v)=>TL.binInsert(m,v)}},
 avl:{num:true,lay:'inorder',build:buildBin,empty:()=>null,sample:[50,30,70,20,40,60,80],
  alg:['AVL: insertar (rotaciones)','AVL: buscar'],
  ops:{'Insertar':(m,v)=>TL.avlInsert(m,v).root,'Eliminar':(m,v)=>TL.avlDelete(m,v).root}},
 rb:{num:true,lay:'inorder',build:buildBin,empty:()=>null,sample:[10,20,30,15,25,5,1],
  alg:['RB: insertar (recoloreo y rotaciones)','RB: buscar'],
  ops:{'Insertar':(m,v)=>TL.rbInsert(m,v).root}},
 b:{num:true,lay:'tidy',build:buildB,empty:()=>({keys:[],kids:[]}),sample:[10,20,5,6,12,30,7,17,3],
  alg:['B: buscar'],
  ops:{'Insertar':(m,v)=>TL.bInsert(m,v).root}},
 bplus:{num:true,lay:'tidy',build:buildBPlus,empty:()=>({leaf:true,keys:[],kids:[]}),sample:[10,20,5,6,12,30,7,17,3],
  alg:['B+: buscar','B+: recorrer hojas'],
  ops:{'Insertar':(m,v)=>TL.bpInsert(m,v).root}},
 trie:{num:false,lay:'tidy',build:buildTrie,empty:()=>({ch:'',end:false,kids:{}}),sample:['casa','cama','canto','perro'],
  alg:['Trie: buscar prefijo'],
  ops:{'Insertar':(m,v)=>TL.trieInsert(m,String(v).toLowerCase()).root}},
 'hash-ch':{num:true,lay:'hashch',build:buildHashCh,empty:()=>({b:Array.from({length:HS},()=>[])}),sample:[7,14,21,3,10,15],
  alg:['Hash: función hash (división)','Hash: buscar (encadenamiento)'],
  ops:{'Insertar':(m,v)=>hashCh(m,+v)}},
 'hash-open':{num:true,lay:'hashopen',build:buildHashOpen,empty:()=>({s:Array(HS).fill(null)}),sample:[7,14,21,3,10],
  alg:['Hash: función hash (división)','Hash: insertar (sondeo lineal)','Hash: buscar (sondeo lineal)'],
  ops:{'Insertar':(m,v)=>hashOpen(m,+v)}}
};

function viewRender(k){
 G.nodes=[];G.edges=[];
 VIEWS[k].build(VM[k]);
 G.directed=true;G.weighted=false;
}
function viewOp(k,name,v){
 VM[k]=VIEWS[k].ops[name](VM[k],v);
 viewRender(k);
}
function loadViewSample(k){
 VM[k]=VIEWS[k].empty();
 VIEWS[k].sample.forEach(v=>{VM[k]=VIEWS[k].ops.Insertar(VM[k],v)});
 viewRender(k);changed();
}
function layoutView(W,H){VLAY[VIEWS[ST].lay](W,H)}
// Registra las operaciones de cada estructura en OPS (los botones del panel)
for(const k in VIEWS){
 OPS[k]={};
 for(const name in VIEWS[k].ops){OPS[k][name]=v=>viewOp(k,name,v)}
 GROUPS[k]=VIEWS[k].alg;
}
