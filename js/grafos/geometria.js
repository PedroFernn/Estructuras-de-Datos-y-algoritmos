/* ---- Geometría ---- */
// Distancia del centro al perímetro del nodo en la dirección (ux,uy), según la forma del skin activo.
function perim(ux,uy){const ax=Math.abs(ux),ay=Math.abs(uy);
 switch(SK.shape){
  case'square':return R/Math.max(ax,ay);
  case'pixel':return Math.min(R/Math.max(ax,ay),1.6*R/(ax+ay)); // cuadrado con esquinas recortadas
  case'hex':{const t=Math.atan2(uy,ux),f=Math.round((t-Math.PI/6)/(Math.PI/3))*Math.PI/3+Math.PI/6;return R*1.1*Math.cos(Math.PI/6)/Math.cos(t-f)}
  default:return R}}
// Arista = curva cuadrática (recta si no hay arista inversa). Los extremos caen en el perímetro, no en el centro.
function geo(e){
 const a=G.nd(e.u),b=G.nd(e.v),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1,px=-dy/L,py=dx/L;
 const bend=G.directed&&G.edges.some(z=>z.u===e.v&&z.v===e.u)?14:0;
 const c={x:(a.x+b.x)/2+px*bend*2,y:(a.y+b.y)/2+py*bend*2};
 const ends=(n,t)=>{const vx=t.x-n.x,vy=t.y-n.y,l=Math.hypot(vx,vy)||1,ux=vx/l,uy=vy/l,d=perim(ux,uy);return{x:n.x+ux*d,y:n.y+uy*d,ux,uy}};
 const s=ends(a,c),t=ends(b,c);
 return{p1:s,p2:t,c,ax:-t.ux,ay:-t.uy,px,py}} // (ax,ay) = dirección de llegada (punta de flecha)
const bez=(g,t)=>({x:(1-t)**2*g.p1.x+2*(1-t)*t*g.c.x+t*t*g.p2.x,y:(1-t)**2*g.p1.y+2*(1-t)*t*g.c.y+t*t*g.p2.y});
