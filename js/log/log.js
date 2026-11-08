function renderLog(f){
 const lg=$('#log');lg.innerHTML=(frames?Recorder.logsRef.slice(0,f.l):[]).map((m,i)=>`<div>${i+1}. ${m.replace(/</g,'&lt;')}</div>`).join('');lg.parentNode.scrollTop=1e9;
 $('#ds').textContent=Object.entries(f.ds).map(([k,v])=>k+': '+JSON.stringify(v)).join('\n');
 $('#ct').textContent=frames?`Paso ${idx}/${frames.length-1}`:'';
}
