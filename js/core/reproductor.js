/* ============ Ejecución segura + Player ============ */
// Nota: Function constructor NO es un sandbox real; se sombrean globales peligrosos y se limita nº de pasos.
const AF=Object.getPrototypeOf(async function(){}).constructor;
let busy=false;
async function run(){busy=true;try{await run0()}finally{busy=false}}
async function run0(){
 const rec=new Recorder(G);Recorder.logsRef=rec.logs;
 try{const fn=new AF('graph','visualizer','params','window','document','fetch','localStorage','globalThis','parent','top','XMLHttpRequest',$('#code').value);
  await fn(G.api(),rec,{start:$('#s').value,end:$('#t').value});
 }catch(e){try{await rec.log('❌ '+e.message)}catch(_){}}
 frames=rec.frames;idx=0;render()}
const delay=()=>1100-$('#sp').value*100;
const invalidate=()=>{stop();frames=null;idx=0;Recorder.logsRef=[]};
function stop(){playing=false;clearTimeout(timer);$('#pl').textContent='▶ Reproducir';$('#pl').classList.add('on')}
async function play(){
 if(playing)return stop();
 if(!frames)await run();if(idx>=frames.length-1)idx=0;
 playing=true;$('#pl').textContent='⏸ Pausar';$('#pl').classList.remove('on');
 const tick=()=>{if(!playing)return;if(idx<frames.length-1){idx++;render();timer=setTimeout(tick,delay())}else stop()};tick()}
$('#pl').onclick=play;
$('#sf').onclick=async()=>{stop();if(!frames)await run();if(idx<frames.length-1)idx++;render()};
$('#sb').onclick=()=>{stop();if(frames&&idx>0)idx--;render()};
$('#bk').onclick=()=>{stop();idx=0;render()};
$('#s').onchange=$('#t').onchange=()=>{stop();frames=null;idx=0;Recorder.logsRef=[];render()};
