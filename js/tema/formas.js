const DASH={solid:'',dashed:'9 6',dotted:'1 7',dither:'4 4'};
const PX=[[-12,-20],[12,-20],[12,-16],[16,-16],[16,-12],[20,-12],[20,12],[16,12],[16,16],[12,16],[12,20],[-12,20],[-12,16],[-16,16],[-16,12],[-20,12],[-20,-12],[-16,-12],[-16,-16],[-12,-16]];
function shapeSvg(n,fill,stroke,sw,dash){
 const a=`fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${dash?'stroke-dasharray="4 3"':''}`,pts=(P,o=0)=>P.map(([x,y])=>`${n.x+x+o},${n.y+y+o}`).join(' ');
 switch(SK.shape){
  case'square':return`<rect x="${n.x-R}" y="${n.y-R}" width="${2*R}" height="${2*R}" rx="3" ${a}/>`;
  case'pixel':return`<polygon points="${pts(PX,4)}" fill="#000" opacity=".5"/><polygon points="${pts(PX)}" ${a}/>`;
  case'hex':return`<polygon points="${pts([0,1,2,3,4,5].map(i=>[R*1.1*Math.cos(i*Math.PI/3),R*1.1*Math.sin(i*Math.PI/3)]))}" ${a}/>`;
  default:return`<circle cx="${n.x}" cy="${n.y}" r="${R}" ${a}/>`}}
