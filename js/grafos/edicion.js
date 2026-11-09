/* ---- Edición inline (renombrar / peso) ---- */
function edit(x,y,val,cb){const i=$('#ed');i.style.cssText=`display:block;left:${x-35}px;top:${y-14}px`;i.value=val;i.focus();i.select();
 i.onkeydown=ev=>{if(ev.key==='Enter'){const v=i.value.trim();i.style.display='none';cb(v)}else if(ev.key==='Escape')i.style.display='none'};i.onblur=()=>i.style.display='none'}
const editW=e=>{if(G.autoW)return msg('Peso automático: se calcula por distancia');const a=G.nd(e.u),b=G.nd(e.v);edit((a.x+b.x)/2,(a.y+b.y)/2,e.w,v=>{const n=parseFloat(v);if(!isNaN(n)){e.w=n;changed()}})};

/* ---- Modos de edición ---- */
let mode='v';
const HINTS={v:'Mover: arrastra nodos · clic selecciona · Supr elimina · doble clic renombra / edita peso · clic en vacío deselecciona',n:'Nodo: clic en el lienzo crea un nodo',e:'Arista: arrastra de origen a destino, o clic en origen y luego en destino (clic derecho también)',d:'Eliminar: clic sobre un nodo o arista'};
function setMode(m){mode=m;pend=null;drag=null;document.querySelectorAll('#tools button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));$('#hint').textContent=HINTS[m];svg.style.cursor={v:'default',n:'copy',e:'crosshair',d:'not-allowed'}[m];render()}
document.querySelectorAll('#tools button').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
const link=(u,v)=>{const e=G.addEdge(u,v);if(e){changed();if(G.weighted&&!G.autoW)editW(e)}};
const msg=t=>{$('#hint').textContent=t;clearTimeout(msg.t);msg.t=setTimeout(()=>$('#hint').textContent=HINTS[mode],2000)};
let raf=0;const soon=()=>raf||(raf=requestAnimationFrame(()=>{raf=0;render();reps()})); // 1 repintado por frame
svg.onpointerdown=ev=>{
 if(ev.button!==0)return;$('#ed').style.display='none';
 const p=pt(ev),n=nodeAt(p.x,p.y),e=n?null:edgeAt(p.x,p.y);
 if(mode==='v'){
  if(n){sel={n:n.id};
   if(playing||busy){msg('⏸ Pausa la reproducción para mover nodos');render();return} // evita carreras con Recorder/Player
   if(G.autoW&&frames)invalidate(); // los pesos van a cambiar: la grabación anterior ya no es válida
   drag={n,mode:'move',x:p.x,y:p.y,dx:n.x-p.x,dy:n.y-p.y};svg.setPointerCapture(ev.pointerId)}else sel=e?{e}:null;
 }else if(mode==='n'){if(!n){sel={n:G.addNode(p.x,p.y).id};changed()}}
 else if(mode==='e'){
  if(n&&pend&&pend!==n.id){link(pend,n.id);pend=null}
  else if(n){drag={n,mode:'edge',x:p.x,y:p.y};svg.setPointerCapture(ev.pointerId)}else pend=null;
 }else if(n){const id=n.id;pedirConfirmacion(txtNodo(id),()=>{G.delNode(id);sel=null;changed()})}else if(e){pedirConfirmacion(txtArista(e),()=>{G.delEdge(e);sel=null;changed()})}
 render()};
svg.onpointermove=ev=>{if(!drag)return;const p=pt(ev);
 if(Math.hypot(p.x-drag.x,p.y-drag.y)>5)drag.moved=true;
 if(drag.mode==='move'){const r=svg.getBoundingClientRect(); // clamp al viewport
  drag.n.x=Math.min(r.width-R,Math.max(R,p.x+drag.dx));drag.n.y=Math.min(r.height-R,Math.max(R,p.y+drag.dy));
  G.recalc(drag.n.id);soon()}else{drag.cur=p;render()}};
svg.onpointerup=ev=>{if(!drag)return;if(drag.mode==='move')reps();const t=nodeAt(pt(ev).x,pt(ev).y);
 if(drag.mode==='edge'){if(drag.moved&&t&&t!==drag.n){link(drag.n.id,t.id);pend=null}else pend=drag.moved?null:(pend===drag.n.id?null:drag.n.id)}
 drag=null;render()};
svg.onpointercancel=()=>{drag=null;render();reps()};
svg.oncontextmenu=ev=>{ev.preventDefault();const p=pt(ev),n=nodeAt(p.x,p.y);
 if(!n)pend=null;else if(!pend)pend=n.id;else{if(pend!==n.id)link(pend,n.id);pend=null}render()};
svg.ondblclick=ev=>{const p=pt(ev),n=nodeAt(p.x,p.y);
 if(n)edit(n.x,n.y,n.id,v=>{if(v&&v!==n.id&&G.rename(n.id,v)){sel={n:v};changed()}});
 else{const e=edgeAt(p.x,p.y);if(e&&G.weighted)editW(e)}};
const MODE_ALT={Digit1:'v',Digit2:'n',Digit3:'e',Digit4:'d'};
document.onkeydown=ev=>{
 if(!$('#confModal').hidden){if(ev.key==='Escape')cerrarConfirmacion(false);else if(ev.key==='Enter')cerrarConfirmacion(true);ev.preventDefault();return}
 const a=document.activeElement,campo=['TEXTAREA','INPUT','SELECT'].includes(a.tagName);
 if(campo){if(ev.altKey&&!ev.ctrlKey&&!ev.metaKey&&MODE_ALT[ev.code]){ev.preventDefault();setMode(MODE_ALT[ev.code])}return}
 const k=ev.key.toLowerCase();if(!ev.ctrlKey&&!ev.metaKey&&k.length===1&&'vned'.includes(k)){setMode(k);return}
 if(sel&&(ev.key==='Delete'||ev.key==='Backspace')){const s=sel;if(s.n){const id=s.n;pedirConfirmacion(txtNodo(id),()=>{G.delNode(id);sel=null;changed()})}else{const ed=s.e;pedirConfirmacion(txtArista(ed),()=>{G.delEdge(ed);sel=null;changed()})}}};
document.addEventListener('change',e=>{if(e.target.tagName==='SELECT')e.target.blur()});
