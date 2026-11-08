/* ============ GraphEngine ============ */
class GraphEngine{
 constructor(){this.nodes=[];this.edges=[];this.directed=false;this.weighted=false;this.autoW=false;this.scale=10}
 key(u,v){return this.directed?u+'>'+v:[u,v].sort().join('-')}
 nd(id){return this.nodes.find(n=>n.id===id)}
 nextName(){for(let i=0;i<26;i++){const c=String.fromCharCode(65+i);if(!this.nd(c))return c}return'N'+this.nodes.length}
 addNode(x,y){const n={id:this.nextName(),x,y};this.nodes.push(n);return n}
 addEdge(u,v){if(u===v||this.edges.some(e=>this.key(e.u,e.v)===this.key(u,v)))return null;const e={u,v,w:1};this.edges.push(e);if(this.autoW)e.w=this.wDist(e);return e}
 rename(o,n){if(!n||this.nd(n))return false;this.nd(o).id=n;this.edges.forEach(e=>{if(e.u===o)e.u=n;if(e.v===o)e.v=n});return true}
 delNode(id){this.nodes=this.nodes.filter(n=>n.id!==id);this.edges=this.edges.filter(e=>e.u!==id&&e.v!==id)}
 delEdge(e){this.edges=this.edges.filter(x=>x!==e)}
 setOpts(d,w){this.directed=d;this.weighted=w;const s=new Set();this.edges=this.edges.filter(e=>{const k=this.key(e.u,e.v);return s.has(k)?false:(s.add(k),true)})}
 w(e){return this.weighted?e.w:1}
 // w(A,B) = floor( dist_euclídea(A,B) / escala )
 wDist(e){const a=this.nd(e.u),b=this.nd(e.v);return Math.floor(Math.hypot(a.x-b.x,a.y-b.y)/this.scale)}
 // Recalcula pesos (solo aristas incidentes a `id`, o todas). api() lee e.w al ejecutar, así los algoritmos usan siempre el valor vigente.
 recalc(id){if(!this.autoW)return false;for(const e of this.edges)if(id===undefined||e.u===id||e.v===id)e.w=this.wDist(e);return true}
 // Vista de solo lectura que reciben los algoritmos
 snapshot(){return{directed:this.directed,weighted:this.weighted,nodes:this.nodes.map(n=>({id:n.id,x:n.x,y:n.y})),edges:this.edges.map(e=>({u:e.u,v:e.v,w:e.w}))}}
 api(){
  const g=this,E=g.edges.map(e=>({from:e.u,to:e.v,weight:g.w(e)}));
  const ratios=g.edges.map(e=>g.w(e)/(Math.hypot(g.nd(e.u).x-g.nd(e.v).x,g.nd(e.u).y-g.nd(e.v).y)||1));
  const k=ratios.length?Math.min(...ratios):0;
  return Object.freeze({directed:g.directed,weighted:g.weighted,nodes:g.nodes.map(n=>n.id),edges:E,
   neighbors:id=>{const o=[];g.edges.forEach(e=>{if(e.u===id)o.push({to:e.v,weight:g.w(e)});else if(!g.directed&&e.v===id)o.push({to:e.u,weight:g.w(e)})});return o},
   children:id=>g.edges.filter(e=>e.u===id).map(e=>e.v).sort((a,b)=>g.nd(a).x-g.nd(b).x),
   left:id=>g.edges.filter(e=>e.u===id&&g.nd(e.v).x<g.nd(id).x).map(e=>e.v)[0],
   right:id=>g.edges.filter(e=>e.u===id&&g.nd(e.v).x>g.nd(id).x).map(e=>e.v)[0],
   h:(a,b)=>{const p=g.nd(a),q=g.nd(b);return Math.hypot(p.x-q.x,p.y-q.y)*k}}); // heurística admisible: distancia euclídea × mínima razón peso/longitud
 }
}
