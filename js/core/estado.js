/* ============ Estado + Canvas ============ */
const G=new GraphEngine(),svg=$('#svg');
let frames=null,idx=0,playing=false,timer=null,sel=null,pend=null,drag=null,repMode='list';
const pt=ev=>{const r=svg.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top}};
const nodeAt=(x,y)=>G.nodes.find(n=>Math.hypot(n.x-x,n.y-y)<=R);
const edgeAt=(x,y)=>{let best=null,bd=10;for(const e of G.edges){const g=geo(e);for(let t=0;t<=1;t+=.1){const q=bez(g,t),d=Math.hypot(q.x-x,q.y-y);if(d<bd){bd=d;best=e}}}return best};
const fr=()=>frames?frames[idx]:{n:{},e:{},ds:{},l:0};

function changed(){stop();frames=null;idx=0;Recorder.logsRef=[];if(ST!=='graph')layout();G.recalc();reps();if(ST!=='graph'){const r=heads()[0];if(r)$('#s').value=r.id}render()}
