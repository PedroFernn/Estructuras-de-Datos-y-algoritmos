function hl(){ // resaltado de sintaxis ligero (overlay)
 const t=$('#code').value;
 $('#hl').innerHTML=t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).replace(/(\/\/.*)|('[^'\n]*'|`[^`]*`)|\b(const|let|var|await|async|function|return|for|of|if|else|while|break|continue|new|true|false|null|undefined|Infinity)\b|\b(\d+\.?\d*)\b/g,(m,c,s,k,n)=>c?`<span class=c>${m}</span>`:s?`<span class=s>${m}</span>`:k?`<span class=k>${m}</span>`:`<span class=n>${m}</span>`)+'\n'}
$('#code').oninput=()=>{hl();$('#alg').value='Personalizado';frames=null;stop()};
$('#code').onscroll=e=>{$('#hl').scrollTop=e.target.scrollTop;$('#hl').scrollLeft=e.target.scrollLeft};
$('#code').onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();const t=e.target,s=t.selectionStart;t.setRangeText('  ',s,t.selectionEnd,'end');t.oninput()}};
$('#code').value=ALGS.BFS;hl();logsRef=[];
