/* ============ Ejecución en Worker + Player ============ */
let busy=false;
async function run(){busy=true;try{await run0()}finally{busy=false}}
async function run0(){
 const res=await runSandbox({code:$('#code').value,graph:G.snapshot(),params:{start:$('#s').value,end:$('#t').value}});
 logsRef=res.logs||[];
 frames=res.frames||[{n:{},e:{},ds:{},l:logsRef.length}];
 idx=0;render()}
const delay=()=>1100-$('#sp').value*100;
const invalidate=()=>{stop();frames=null;idx=0;logsRef=[]};
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
$('#s').onchange=$('#t').onchange=()=>{stop();frames=null;idx=0;logsRef=[];render()};
