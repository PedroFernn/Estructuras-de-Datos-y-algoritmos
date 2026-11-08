function reps(){
 const ids=G.nodes.map(n=>n.id);let h='';
 if(repMode==='list'){
  h='<table>'+ids.map(id=>{const nb=G.api().neighbors(id).map(x=>G.weighted?`${x.to}(${x.weight})`:x.to);return`<tr><th>${id}</th><td style="text-align:left">${nb.join(', ')||'—'}</td></tr>`}).join('')+'</table>';
 }else{
  h='<table><tr><th></th>'+ids.map(i=>`<th>${i}</th>`).join('')+'</tr>'+ids.map(r=>`<tr><th>${r}</th>`+ids.map(c=>{const e=G.edges.find(e=>(e.u===r&&e.v===c)||(!G.directed&&e.u===c&&e.v===r));return`<td>${e?G.w(e):0}</td>`}).join('')+'</tr>').join('')+'</table>';
 }
 $('#rep').innerHTML=h;
 for(const id of['s','t']){const el=$('#'+id),v=el.value;el.innerHTML=ids.map(i=>`<option>${i}</option>`).join('');if(ids.includes(v))el.value=v;else if(id==='t'&&ids.length>1)el.value=ids[ids.length-1]}
}
