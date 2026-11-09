/* ============ Listas y árboles (sobre el mismo GraphEngine) ============ */
// Lista = grafo dirigido en cadena; Árbol BST = grafo dirigido padre→hijo. Los algoritmos usan la misma API `visualizer`.
let ST='graph';
const GROUPS={graph:['BFS','DFS','Dijkstra','A*','Prim','Kruskal'],list:['Lista: recorrer','Lista: buscar','Lista: nodo medio','Lista: detectar ciclo'],tree:['Preorden','Inorden','Postorden','Por niveles','BST: buscar','Altura','Validar BST']};
function fillAlg(s){$('#alg').innerHTML=GROUPS[s].map(k=>'<option>'+k+'</option>').join('')+'<option>Personalizado</option>';$('#code').value=ALGS[GROUPS[s][0]];hl()}

const heads=()=>G.nodes.filter(n=>!G.edges.some(e=>e.v===n.id));
const succ=id=>{const e=G.edges.find(e=>e.u===id);return e&&e.v};
const mk=v=>{G.nodes.push({id:v,x:0,y:0})};

const OPS={}; // OPS.list y OPS.tree se registran en listas/listas.js y arboles/arboles.js
function run1(k){const i=$('#val'),v=i.value.trim(),f=OPS[ST][k];if(!f.noval&&(!v||((ST==='tree'||(LIN[ST]&&LIN[ST].num)||(VIEWS[ST]&&VIEWS[ST].num))&&isNaN(+v))))return;f(v);i.value='';changed();i.focus()}
function layout(){
 const W=svg.clientWidth||600,H=svg.clientHeight||400,seen=new Set(),nxt=id=>G.edges.filter(e=>e.u===id&&e.kind!=='prev').map(e=>e.v).filter(x=>!seen.has(x));
 if(VIEWS[ST])return layoutView(W,H);
 if(LIN[ST]&&LIN[ST].build==='heap')return layoutHeap(W,H);
 return ST==='tree'?layoutArbol(W,H,seen,nxt):layoutLista(W,H,seen,nxt)}
function setStruct(t){
 ST=t;const g=t==='graph',o=OPS[t]||{},ks=Object.keys(o);
 $('#dir').disabled=$('#wt').disabled=$('#auto').disabled=!g;if(!g){G.autoW=false;$('#auto').checked=false}if(!g){$('#dir').checked=true;$('#wt').checked=false;G.setOpts(true,false)}
 G.nodes=[];G.edges=[];sel=null;fillAlg(t);
 $('#ops').innerHTML=ks.length?'<input id="val" size="5" placeholder="valor">'+ks.map(k=>'<button data-k="'+k+'">'+k+'</button>').join(''):'';
 $('#ops').querySelectorAll('button').forEach(b=>b.onclick=()=>run1(b.dataset.k));
 if(ks.length)$('#val').onkeydown=e=>{if(e.key==='Enter')run1(ks[0])};
 loadSample()}
function loadSample(){if(ST==='graph')return gSmp();if(LIN[ST])return loadLinSample(ST);if(VIEWS[ST])return loadViewSample(ST);(ST==='list'?['4','7','2','9']:['50','30','70','20','40','60','80']).forEach(v=>OPS[ST][ST==='list'?'Insertar final':'Insertar'](v));changed()}
