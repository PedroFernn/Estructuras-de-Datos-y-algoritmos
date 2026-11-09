/* ============ Lógica pura de árboles (se usa en la app y dentro del Worker) ============ */
// Cada inserción/eliminación devuelve { root, ev }. ev son eventos para animar: visit, new, rot, split.
const TREE_LIB=`
var BMAX=3;
function mkBin(v){return {v:v,l:null,r:null}}
function binInsert(root,v){
 if(!root)return mkBin(v);
 const q=[root];
 while(q.length){const n=q.shift();if(n.v===v)return root;
  if(!n.l){n.l=mkBin(v);return root} q.push(n.l);
  if(!n.r){n.r=mkBin(v);return root} q.push(n.r)}
 return root;
}
function ht(n){return n?n.h:0}
function fixH(n){n.h=1+Math.max(ht(n.l),ht(n.r));return n}
function rotR(y){const x=y.l;y.l=x.r;x.r=y;fixH(y);return fixH(x)}
function rotL(x){const y=x.r;x.r=y.l;y.l=x;fixH(x);return fixH(y)}
function bal(n){return ht(n.l)-ht(n.r)}
function avlIns(n,v,ev){
 if(!n){ev.push({t:'new',lab:String(v)});return {v:v,l:null,r:null,h:1}}
 ev.push({t:'visit',lab:String(n.v)});
 if(v<n.v)n.l=avlIns(n.l,v,ev);else if(v>n.v)n.r=avlIns(n.r,v,ev);else return n;
 fixH(n);const b=bal(n);
 if(b>1&&v<n.l.v){ev.push({t:'rot',k:'LL',lab:String(n.v)});return rotR(n)}
 if(b<-1&&v>n.r.v){ev.push({t:'rot',k:'RR',lab:String(n.v)});return rotL(n)}
 if(b>1&&v>n.l.v){ev.push({t:'rot',k:'LR',lab:String(n.v)});n.l=rotL(n.l);return rotR(n)}
 if(b<-1&&v<n.r.v){ev.push({t:'rot',k:'RL',lab:String(n.v)});n.r=rotR(n.r);return rotL(n)}
 return n;
}
function avlDel(n,v,ev){
 if(!n)return null;
 ev.push({t:'visit',lab:String(n.v)});
 if(v<n.v)n.l=avlDel(n.l,v,ev);
 else if(v>n.v)n.r=avlDel(n.r,v,ev);
 else{if(!n.l||!n.r)return n.l||n.r;let m=n.r;while(m.l)m=m.l;n.v=m.v;n.r=avlDel(n.r,m.v,ev)}
 fixH(n);const b=bal(n);
 if(b>1&&bal(n.l)>=0){ev.push({t:'rot',k:'LL',lab:String(n.v)});return rotR(n)}
 if(b>1&&bal(n.l)<0){ev.push({t:'rot',k:'LR',lab:String(n.v)});n.l=rotL(n.l);return rotR(n)}
 if(b<-1&&bal(n.r)<=0){ev.push({t:'rot',k:'RR',lab:String(n.v)});return rotL(n)}
 if(b<-1&&bal(n.r)>0){ev.push({t:'rot',k:'RL',lab:String(n.v)});n.r=rotR(n.r);return rotL(n)}
 return n;
}
function avlInsert(root,v){const ev=[];const r=avlIns(root,v,ev);return {root:r,ev:ev}}
function avlDelete(root,v){const ev=[];const r=avlDel(root,v,ev);return {root:r,ev:ev}}
function rbIns(n,v,ev){
 if(!n){ev.push({t:'new',lab:String(v)});return {v:v,c:'R',l:null,r:null}}
 ev.push({t:'visit',lab:String(n.v)});
 if(v<n.v)n.l=rbIns(n.l,v,ev);else if(v>n.v)n.r=rbIns(n.r,v,ev);else return n;
 return rbBal(n,ev);
}
function rbBal(n,ev){
 if(n.c!=='B')return n;
 const L=n.l,R=n.r;let x,y,z,t1,t2,t3,t4,k;
 if(L&&L.c==='R'&&L.l&&L.l.c==='R'){k='LL';x=L.l;y=L;z=n;t1=x.l;t2=x.r;t3=y.r;t4=z.r}
 else if(L&&L.c==='R'&&L.r&&L.r.c==='R'){k='LR';x=L;y=L.r;z=n;t1=x.l;t2=y.l;t3=y.r;t4=z.r}
 else if(R&&R.c==='R'&&R.l&&R.l.c==='R'){k='RL';x=n;y=R.l;z=R;t1=n.l;t2=y.l;t3=y.r;t4=z.r}
 else if(R&&R.c==='R'&&R.r&&R.r.c==='R'){k='RR';x=n;y=R;z=R.r;t1=n.l;t2=R.l;t3=z.l;t4=z.r}
 else return n;
 ev.push({t:'rot',k:k,lab:String(n.v)});
 x.c='B';x.l=t1;x.r=t2;z.c='B';z.l=t3;z.r=t4;y.c='R';y.l=x;y.r=z;
 return y;
}
function rbInsert(root,v){const ev=[];const r=rbIns(root,v,ev);r.c='B';return {root:r,ev:ev}}
function bLab(n){return n.keys.join('|')}
function bIns(n,v,ev){
 ev.push({t:'visit',lab:bLab(n)});
 if(!n.kids.length){if(n.keys.indexOf(v)<0){n.keys.push(v);n.keys.sort(function(a,b){return a-b})}}
 else{
  if(n.keys.indexOf(v)>=0)return {n:n};
  let i=0;while(i<n.keys.length&&v>n.keys[i])i++;
  const res=bIns(n.kids[i],v,ev);
  if(res.up){n.keys.splice(i,0,res.up.k);n.kids[i]=res.n;n.kids.splice(i+1,0,res.up.r)}
  else n.kids[i]=res.n;
 }
 if(n.keys.length>BMAX){
  const m=Math.floor(n.keys.length/2),k=n.keys[m];
  const r={keys:n.keys.slice(m+1),kids:n.kids.slice(m+1)};
  ev.push({t:'split',lab:bLab(n),k:k});
  n.keys=n.keys.slice(0,m);n.kids=n.kids.slice(0,m+1);
  return {n:n,up:{k:k,r:r}};
 }
 return {n:n};
}
function bInsert(root,v){
 const ev=[];const res=bIns(root,v,ev);
 if(res.up)return {root:{keys:[res.up.k],kids:[res.n,res.up.r]},ev:ev};
 return {root:res.n,ev:ev};
}
function bpIns(n,v,ev){
 ev.push({t:'visit',lab:bLab(n)});
 if(n.leaf){
  if(n.keys.indexOf(v)<0){n.keys.push(v);n.keys.sort(function(a,b){return a-b})}
  if(n.keys.length>BMAX){
   const m=Math.ceil(n.keys.length/2),r={leaf:true,keys:n.keys.slice(m),kids:[]};
   n.keys=n.keys.slice(0,m);
   ev.push({t:'split',lab:bLab(n),k:r.keys[0]});
   return {n:n,up:{k:r.keys[0],r:r}};
  }
  return {n:n};
 }
 let i=0;while(i<n.keys.length&&v>=n.keys[i])i++;
 const res=bpIns(n.kids[i],v,ev);
 if(res.up){
  n.keys.splice(i,0,res.up.k);n.kids[i]=res.n;n.kids.splice(i+1,0,res.up.r);
  if(n.keys.length>BMAX){
   const m=Math.floor(n.keys.length/2),k=n.keys[m];
   const r={leaf:false,keys:n.keys.slice(m+1),kids:n.kids.slice(m+1)};
   ev.push({t:'split',lab:bLab(n),k:k});
   n.keys=n.keys.slice(0,m);n.kids=n.kids.slice(0,m+1);
   return {n:n,up:{k:k,r:r}};
  }
 }else n.kids[i]=res.n;
 return {n:n};
}
function bpInsert(root,v){
 const ev=[];const res=bpIns(root,v,ev);
 if(res.up)return {root:{leaf:false,keys:[res.up.k],kids:[res.n,res.up.r]},ev:ev};
 return {root:res.n,ev:ev};
}
function trieInsert(root,w){
 let n=root;
 for(const c of w){if(!n.kids[c])n.kids[c]={ch:c,end:false,kids:{}};n=n.kids[c]}
 n.end=true;
 return {root:root,ev:[]};
}
`;
