Object.keys(SKINS).forEach(id=>registerSkin(id,SKINS[id]));
$('#theme').onchange=e=>applySkin(SKINS[e.target.value]);
$('#skj').value=JSON.stringify({name:'Mi tema',font:'monospace',shape:'hex',line:'dashed',width:3,pathWidth:5,palette:{bg:'#101820',panel:'#1b2733',text:'#f2f2f2',border:'#3a4a5a',edge:'#7f8c9a',accent:'#ffb000'},states:{unvisited:'#2b3a49',queued:'#ffb000',current:'#00c2ff',visited:'#2ecc71',path:'#ff5e8a'}},null,2);
$('#ska').onclick=()=>{try{const c=JSON.parse($('#skj').value);registerSkin('custom',c);$('#theme').value='custom';applySkin(c);$('#skm').textContent='✔ Tema aplicado'}catch(e){$('#skm').textContent='❌ '+e.message}};
