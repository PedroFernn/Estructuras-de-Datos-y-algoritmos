/* ============ Selector de estructuras en niveles: categoría → familia → variante ============ */
// Solo se muestran los niveles necesarios. Las entradas con pend:true aún no están implementadas.
const ESTR=[
 {label:'Lineales',items:[
  {label:'Arreglo',st:'array'},
  {label:'Pila',st:'stack'},
  {label:'Cola',items:[{label:'Cola simple',st:'queue'},{label:'Deque',st:'deque'},{label:'Cola de prioridad',st:'pq'}]},
  {label:'Lista enlazada',items:[{label:'Simple',st:'list'},{label:'Doble',st:'dlist'},{label:'Circular',st:'clist'}]}
 ]},
 {label:'No lineales',items:[
  {label:'Grafo',st:'graph'},
  {label:'Árbol',items:[
   {label:'BST',st:'tree'},
   {label:'Binario',st:'bin'},{label:'AVL',st:'avl'},{label:'Rojinegro',st:'rb'},
   {label:'B',st:'b'},{label:'B+',st:'bplus'},{label:'Trie',st:'trie'}]},
  {label:'Montículo (heap)',items:[{label:'Mín-Heap',st:'heap'},{label:'Máx-Heap',st:'heapmax'}]},
  {label:'Tabla hash',items:[{label:'Encadenamiento',st:'hash-ch'},{label:'Sondeo lineal',st:'hash-open'}]}
 ]}
];
let SEL={c:1,f:0,v:0};
const firstAvail=items=>Math.max(0,items.findIndex(it=>!it.pend));
const optsHTML=items=>items.map((it,i)=>`<option value="${i}"${it.pend?' disabled':''}>${it.label}${it.pend?' · próximamente':''}</option>`).join('');
const famItems=()=>ESTR[SEL.c].items;
const leafNode=()=>{const f=famItems()[SEL.f];return f.items?f.items[SEL.v]:f};
function renderSel(){
 $('#cat').innerHTML=ESTR.map((c,i)=>`<option value="${i}">${c.label}</option>`).join('');$('#cat').value=SEL.c;
 $('#fam').innerHTML=optsHTML(famItems());$('#fam').value=SEL.f;
 const f=famItems()[SEL.f];
 if(f.items){$('#lvar').hidden=false;$('#var').innerHTML=optsHTML(f.items);$('#var').value=SEL.v}
 else $('#lvar').hidden=true;
}
function applySel(){const l=leafNode();if(!l.pend)setStruct(l.st)}
function initSelector(){
 $('#cat').onchange=()=>{SEL.c=+$('#cat').value;SEL.f=firstAvail(famItems());const f=famItems()[SEL.f];SEL.v=f.items?firstAvail(f.items):0;renderSel();applySel()};
 $('#fam').onchange=()=>{SEL.f=+$('#fam').value;const f=famItems()[SEL.f];SEL.v=f.items?firstAvail(f.items):0;renderSel();applySel()};
 $('#var').onchange=()=>{SEL.v=+$('#var').value;applySel()};
 renderSel();
}
// Selecciona una estructura por su clave interna (p. ej. 'stack', 'dlist', 'tree').
function selectStruct(st){
 ESTR.forEach((c,ci)=>c.items.forEach((f,fi)=>{
  if(f.st===st){SEL={c:ci,f:fi,v:0}}
  else if(f.items)f.items.forEach((v,vi)=>{if(v.st===st)SEL={c:ci,f:fi,v:vi}});
 }));
 renderSel();applySel();
}
