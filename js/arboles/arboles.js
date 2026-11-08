function bstIns(v){if(G.nd(v))return;const r=heads()[0];mk(v);if(!r)return;let u=r.id;
 for(;;){const c=G.edges.filter(e=>e.u===u).map(e=>e.v).find(x=>(+x<+u)===(+v<+u));if(c===undefined){G.addEdge(u,v);return}u=c}}
function bstDel(v){const r=heads()[0];if(!r||!G.nd(v))return;const vals=[],pre=u=>{if(u!==v)vals.push(u);G.edges.filter(e=>e.u===u).map(e=>e.v).forEach(pre)};
 pre(r.id);G.nodes=[];G.edges=[];vals.forEach(bstIns)} // reconstruye el BST sin el valor eliminado
OPS.tree={'Insertar':bstIns,'Eliminar':bstDel};

function layoutArbol(W,H,seen,nxt){let c=0;
 const go=(id,d)=>{seen.add(id);const k=nxt(id),isL=x=>+x<+id;k.filter(isL).forEach(x=>{if(!seen.has(x))go(x,d+1)});const n=G.nd(id);n.k=c++;n.y=80+d*70;k.filter(x=>!isL(x)).forEach(x=>{if(!seen.has(x))go(x,d+1)})};
  for(const h of[...heads(),...G.nodes])if(!seen.has(h.id))go(h.id,0);
  const st=Math.min(60,(W-80)/Math.max(c-1,1));G.nodes.forEach(n=>n.x=40+n.k*st)}
