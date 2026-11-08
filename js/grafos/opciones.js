/* ============ UI: opciones, editor, tabs ============ */
$('#auto').onchange=e=>{G.autoW=e.target.checked;if(G.autoW){$('#wt').checked=true;G.setOpts(G.directed,true)}changed()};
$('#esc').oninput=e=>{G.scale=Math.max(1,+e.target.value||10);changed()};
$('#dir').onchange=$('#wt').onchange=()=>{if(!$('#wt').checked){$('#auto').checked=false;G.autoW=false}G.setOpts($('#dir').checked,$('#wt').checked);changed()};
$('#clr').onclick=()=>{G.nodes=[];G.edges=[];sel=null;changed()};
$('#rt').onclick=()=>{repMode=repMode==='list'?'matrix':'list';$('#rt').textContent='Ver: '+(repMode==='list'?'Lista':'Matriz');reps()};
$('#smp').onclick=()=>{G.nodes=[];G.edges=[];const W=svg.clientWidth||600,P=[[.12,.3],[.35,.12],[.35,.6],[.62,.2],[.62,.75],[.88,.45]];
 P.forEach(([a,b])=>G.addNode(a*W,b*(svg.clientHeight||400)+30));
 [['A','B',4],['A','C',2],['B','C',1],['B','D',5],['C','E',8],['D','E',2],['D','F',6],['E','F',3]].forEach(([u,v,w])=>G.addEdge(u,v).w=w);
 G.setOpts(false,true);$('#dir').checked=false;$('#wt').checked=true;changed()};
