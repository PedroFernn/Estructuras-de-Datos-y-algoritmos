/* ============ Skins (temas) ============ */
const BASE={name:'Moderno',shape:'circle',line:'solid',width:2.5,pathWidth:4,palette:{},states:{unvisited:'#334155',queued:'#f59e0b',current:'#38bdf8',visited:'#22c55e',path:'#a855f7'}};
const SKINS={modern:BASE,
 pixel:{name:'Pixel Art',font:"'Press Start 2P','VT323',monospace",fontSize:'10px',radius:'0px',shadow:'3px 3px 0 #000',shape:'pixel',line:'dither',width:4,pathWidth:6,crisp:true,scan:true,
  palette:{bg:'#0d0221',panel:'#1a0b3b',text:'#39ff14',muted:'#b967ff',border:'#ff2e97',edge:'#6c4ab6',accent:'#00f0ff'},
  states:{unvisited:'#2a1a5e',queued:'#ffd23f',current:'#00f0ff',visited:'#39ff14',path:'#ff2e97'}}};
const PAL={bg:'--bg',panel:'--pn',text:'--fg',muted:'--mu',border:'--bd',edge:'--ed',accent:'--ac'};
let SK=BASE,applied=[];
function applySkin(c){
 const sk={...BASE,...c,palette:{...c.palette},states:{...BASE.states,...c.states}};SK=sk;
 const css={};for(const k in sk.palette)if(PAL[k])css[PAL[k]]=sk.palette[k];
 if(sk.font)css['--font']=sk.font;if(sk.fontSize)css['--fs']=sk.fontSize;if(sk.radius)css['--r']=sk.radius;if(sk.shadow)css['--sh']=sk.shadow;
 const r=document.documentElement.style;applied.forEach(k=>r.removeProperty(k));applied=Object.keys(css);applied.forEach(k=>r.setProperty(k,css[k]));
 Object.assign(COLORS,sk.states);document.body.toggleAttribute('data-scan',!!sk.scan);
 svg.style.imageRendering=sk.crisp?'pixelated':'';svg.setAttribute('shape-rendering',sk.crisp?'crispEdges':'auto');render()}
function registerSkin(id,cfg){SKINS[id]=cfg;const t=$('#theme');if(![...t.options].some(o=>o.value===id))t.add(new Option(cfg.name||id,id))}
window.registerSkin=registerSkin;
