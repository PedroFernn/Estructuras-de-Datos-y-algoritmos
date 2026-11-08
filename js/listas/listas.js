OPS.list={'Insertar final':v=>{if(G.nd(v))return;let t=heads()[0],k=0;while(t&&succ(t.id)!==undefined&&k++<99)t=G.nd(succ(t.id));mk(v);if(t)G.addEdge(t.id,v)},
  'Insertar inicio':v=>{if(G.nd(v))return;const h=heads()[0];mk(v);if(h)G.addEdge(v,h.id)},
  'Eliminar':v=>{if(!G.nd(v))return;const p=G.edges.find(e=>e.v===v),n=succ(v);G.delNode(v);if(p&&n!==undefined)G.addEdge(p.u,n)}};

function layoutLista(W,H,seen,nxt){let c=0;
 for(const h of[...heads(),...G.nodes]){let u=h.id;while(u!==undefined&&!seen.has(u)){seen.add(u);G.nd(u).k=c++;u=nxt(u)[0]}}
  const st=Math.min(90,(W-80)/Math.max(c-1,1));G.nodes.forEach(n=>{n.x=40+n.k*st;n.y=H/2})}
