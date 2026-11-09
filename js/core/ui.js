$('#alg').onchange=e=>{if(e.target.value!=='Personalizado'){$('#code').value=ALGS[e.target.value];hl()}stop();frames=null;idx=0;render()};
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button,.pane').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('#'+b.dataset.p).classList.add('on')});
const gSmp=$('#smp').onclick;$('#smp').onclick=loadSample;initSelector();fillAlg('graph');
