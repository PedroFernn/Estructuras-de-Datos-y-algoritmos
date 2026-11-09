function render(){
 const f=fr();let h='';
 for(const e of G.edges){
  const g=geo(e),st=f.e[G.key(e.u,e.v)],c=st&&st!=='unvisited'?col(st):null,isP=st==='path',s=sel&&sel.e===e;
  const stk=s?'var(--ac)':c||'var(--ed)',sw=(isP?SK.pathWidth:SK.width)+(s?1:0),da=isP?'':DASH[SK.line]||'';
  const tip=g.p2,bx=tip.x-(G.directed?g.ax*11:0),by=tip.y-(G.directed?g.ay*11:0); // la línea termina en la base de la flecha
  h+=`<path d="M${g.p1.x} ${g.p1.y}Q${g.c.x} ${g.c.y} ${bx} ${by}" fill="none" stroke="${stk}" stroke-width="${sw}" ${da?`stroke-dasharray="${da}"`:''} ${SK.line==='dotted'?'stroke-linecap="round"':''}/>`;
  if(G.directed)h+=`<polygon fill="${stk}" points="${tip.x},${tip.y} ${tip.x-g.ax*13-g.ay*5},${tip.y-g.ay*13+g.ax*5} ${tip.x-g.ax*13+g.ay*5},${tip.y-g.ay*13-g.ax*5}"/>`;
  if(G.weighted){const m=bez(g,.5);h+=`<text x="${m.x+g.px*9}" y="${m.y+g.py*9+4}" text-anchor="middle" fill="var(--fg)" stroke="var(--bg)" stroke-width="4" paint-order="stroke" style="font-size:calc(var(--fs,14px) - 2px)">${e.w}</text>`}
 }
 if(drag&&drag.mode==='edge'&&drag.cur){const a=drag.n;h+=`<line x1="${a.x}" y1="${a.y}" x2="${drag.cur.x}" y2="${drag.cur.y}" stroke="var(--ac)" stroke-dasharray="4 4"/>`}
 for(const n of G.nodes){
  const st=f.n[n.id]||n.color||'unvisited',s=sel&&sel.n===n.id,p=pend===n.id;
  h+=shapeSvg(n,col(st),s?'var(--fg)':p?'#f59e0b':'var(--ed)',s||p?3:2,p)+`<text x="${n.x}" y="${n.y+4}" text-anchor="middle" fill="${st==='unvisited'?'var(--fg)':(st==='rb-B'?'#ffffff':'#04121f')}" font-weight="600" pointer-events="none">${n.label??n.id}</text>`;
 }
 svg.innerHTML=h;
 renderLog(f);
}
