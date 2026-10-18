import {FACTORS, GROUPS, DOORS, INTENSITIES, JAVANAS, SOURCES, BY_ID} from './data.js';
import {createProcess, validateProcess, DEFAULT_CONFIG} from './engine.js';
import {associationStatus} from './association.js';
import {mountMatrix} from './matrix-ui.js';
import {mountConditions} from './conditions-ui.js';

const $=id=>document.getElementById(id);
const dom={
 door:$('door'),intensity:$('intensity'),intensityLabel:$('intensityLabel'),mindClarity:$('mindClarity'),javana:$('javana'),followMind:$('followMind'),nextJavana:$('nextJavana'),interludeCount:$('interludeCount'),followOptions:$('followOptions'),
 play:$('playBtn'),step:$('stepBtn'),back:$('backBtn'),reset:$('resetBtn'),speed:$('speed'),export:$('exportBtn'),
 timeline:$('timeline'),network:$('network'),factorList:$('factorList'),factorSearch:$('factorSearch'),factorGroup:$('factorGroup')
};
let process=createProcess(),current=0,selectedFactor=29,timer=null,onlyActive=false;
let matrixUi=null,conditionsUi=null;

function option(value,label){const el=document.createElement('option');el.value=value;el.textContent=label;return el;}
for(const d of DOORS)dom.door.add(option(d.id,d.name));
for(const d of INTENSITIES)dom.intensity.add(option(d.id,d.name));
for(const d of JAVANAS){dom.javana.add(option(d.id,d.name));dom.nextJavana.add(option(d.id,d.name));}
for(const g of GROUPS)dom.factorGroup.add(option(g.id,`${g.name} (${g.count})`));
for(const s of SOURCES){const li=document.createElement('li'),a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=s.title+' ↗';li.append(a);$('sourceLinks').append(li);}

dom.door.value=DEFAULT_CONFIG.door;
dom.intensity.value=DEFAULT_CONFIG.intensity;
dom.mindClarity.value=DEFAULT_CONFIG.mindClarity;
dom.javana.value=DEFAULT_CONFIG.javana;
dom.nextJavana.value=DEFAULT_CONFIG.nextJavana;dom.interludeCount.value=String(DEFAULT_CONFIG.interludeCount);

function configFromForm(){return {door:dom.door.value,intensity:dom.intensity.value,mindClarity:dom.mindClarity.value,javana:dom.javana.value,followMind:dom.followMind.checked,nextJavana:dom.nextJavana.value,interludeCount:Number(dom.interludeCount.value)};}
function updateInputs(){
 const mind=dom.door.value==='mind',tiny=dom.intensity.value==='very-slight';
 dom.intensity.hidden=mind;dom.intensityLabel.hidden=mind;
 dom.mindClarity.previousElementSibling.hidden=!(mind||dom.followMind.checked);
 dom.mindClarity.hidden=!(mind||dom.followMind.checked);
 dom.followMind.disabled=mind||tiny;
 if(dom.followMind.disabled)dom.followMind.checked=false;
 dom.followOptions.hidden=!dom.followMind.checked;
 $('javanaDescription').textContent=JAVANAS.find(x=>x.id===dom.javana.value).description;
}
function stop(){if(timer!==null){clearInterval(timer);timer=null;}dom.play.textContent='▶ เริ่มเล่น';}
function rebuild(){stop();updateInputs();process=createProcess(configFromForm());validateProcess(process);current=0;render();}
for(const id of ['door','intensity','mindClarity','javana','nextJavana','interludeCount'])$(id).addEventListener('change',rebuild);
dom.followMind.addEventListener('change',rebuild);
dom.speed.addEventListener('change',()=>{if(timer!==null){stop();play();}});

function setCurrent(index){current=Math.min(process.moments.length-1,Math.max(0,index));render();const focus=dom.timeline.querySelector('.timeline-step.active');if(focus)focus.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
function next(){if(current<process.moments.length-1)setCurrent(current+1);else stop();}
function previous(){stop();setCurrent(current-1);}
function play(){if(current===process.moments.length-1)current=0;stop();dom.play.textContent='Ⅱ หยุด';timer=setInterval(next,Number(dom.speed.value));render();}
dom.play.addEventListener('click',()=>timer===null?play():stop());
dom.step.addEventListener('click',()=>{stop();next();});
dom.back.addEventListener('click',previous);
dom.reset.addEventListener('click',()=>{stop();setCurrent(0);});
dom.export.addEventListener('click',()=>{
 const data={...process,exportedAt:new Date().toISOString(),selectedMoment:process.moments[current].id,source:SOURCES};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='jit-vithi-'+process.config.door+'-'+process.config.javana+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
});
document.addEventListener('keydown',e=>{
 const tag=e.target?.tagName?.toLowerCase();if(['input','textarea','select','button'].includes(tag)||e.altKey||e.metaKey||e.ctrlKey)return;
 if(e.key==='ArrowRight'){e.preventDefault();stop();next();}
 if(e.key==='ArrowLeft'){e.preventDefault();previous();}
 if(e.code==='Space'){e.preventDefault();timer===null?play():stop();}
});

function render(){
 const m=process.moments[current];
 $('totalMoments').textContent=process.moments.length;
 $('activeCount').textContent=m.activeCount;
 $('javanaCount').textContent=process.moments.filter(m=>m.stage==='javana').length;
 $('stepCounter').textContent=`${String(current+1).padStart(2,'0')} / ${process.moments.length}`;
 renderTimeline();renderMoment(m);renderGraph(m);renderFactors(m);renderFactorDetail(m);conditionsUi?.render();
}
function renderTimeline(){
 dom.timeline.replaceChildren();
 $('cycleLabels').replaceChildren();
 for(const c of process.cycles){const p=document.createElement('span');p.textContent=`${c.title}: ${c.note}`;$('cycleLabels').append(p);}
 for(const [i,m] of process.moments.entries()){
  const btn=document.createElement('button');btn.type='button';btn.className='timeline-step'+(i===current?' active':'');btn.dataset.phase=m.phase;btn.setAttribute('aria-current',i===current?'step':'false');btn.title=`ขณะ ${i+1}: ${m.name} (${m.citta})`;
  const n=document.createElement('span');n.className='step-num';n.textContent=String(i+1).padStart(2,'0');
  const name=document.createElement('span');name.className='step-name';name.textContent=m.name+(m.javanaOrdinal?` ${m.javanaOrdinal}/7`:'');
  const tag=document.createElement('span');tag.className='step-tag';tag.textContent=m.phase.toUpperCase();
  btn.append(n,name,tag);btn.addEventListener('click',()=>{stop();setCurrent(i);});dom.timeline.append(btn);
 }
}
const FAMILIES={vipaka:['VIPĀKA','วิบากจิต'],kiriya:['KIRIYĀ','กิริยาจิต'],kusala:['KUSALA','กุศลจิต'],akusala:['AKUSALA','อกุศลจิต']};
function renderMoment(m){
 $('momentNumber').textContent=String(current+1).padStart(2,'0');
 $('momentName').textContent=m.name+(m.javanaOrdinal?` · ${m.javanaOrdinal}/7`:'');
 $('momentPali').textContent=m.pali;
 $('momentPhase').textContent=m.phase.toUpperCase();
 $('momentDesc').textContent=m.description;
 $('momentCitta').textContent=`${m.citta} · ${m.cittaId}/121`;
 $('momentObject').textContent=m.object;
 $('momentFactorCount').textContent=`${m.activeCount} / 52 ดวง`;
 $('cittaFamily').textContent=FAMILIES[m.family][0]+' · '+FAMILIES[m.family][1];
 $('javanaNote').hidden=m.stage!=='javana';if(m.stage==='javana')$('javanaNote').textContent=m.note+' · ชวนจิตเจ็ดขณะในวิถีนี้มีประเภทจิตเดียวกัน ไม่ใช่ตัวแปรสะสมเพิ่ม';
}

const NS='http://www.w3.org/2000/svg';
function svg(tag,attrs={},content){const e=document.createElementNS(NS,tag);for(const [name,value] of Object.entries(attrs))e.setAttribute(name,String(value));if(content!==undefined)e.textContent=content;return e;}
const GROUP_LAYOUT=[
 {id:'universal',x:23,y:23,w:541,h:300,cols:4},
 {id:'occasional',x:637,y:23,w:540,h:300,cols:3},
 {id:'unwholesome',x:23,y:490,w:541,h:325,cols:4},
 {id:'beautiful',x:637,y:490,w:540,h:325,cols:5}
];
function renderGraph(m){
 const n=dom.network;n.replaceChildren();
 const defs=svg('defs');const gradient=svg('linearGradient',{id:'edge-gradient',x1:'0',x2:'1',y1:'0',y2:'1'});
 gradient.append(svg('stop',{offset:'0%', 'stop-color':'#68daca','stop-opacity':'.75'}),svg('stop',{offset:'100%','stop-color':'#357ab3','stop-opacity':'.2'}));defs.append(gradient);n.append(defs);
 // Deliberate analogy: stylized circuitry, not an anatomical or neural claim.
 const central=svg('g',{'aria-hidden':'true'});
 for(let i=0;i<5;i++)central.append(svg('ellipse',{cx:600,cy:410,rx:210+i*31,ry:117+i*17,fill:'none',stroke:'#164e67','stroke-width':'1','stroke-opacity':.22+(i*.04)}));
 for(const layout of GROUP_LAYOUT){const cx=layout.x+layout.w/2,cy=layout.y+layout.h/2;
  const path=svg('path',{class:'network-arc',d:`M600 405 Q${(600+cx)/2} ${(405+cy)/2-28} ${cx} ${cy}`,stroke:'url(#edge-gradient)'});central.append(path);
 }
 n.append(central);
 for(const layout of GROUP_LAYOUT){
  const group=GROUPS.find(g=>g.id===layout.id),factors=FACTORS.filter(f=>f.group===layout.id),r=svg('g');
  r.append(svg('rect',{class:'graph-box',x:layout.x,y:layout.y,width:layout.w,height:layout.h,rx:18}));
  r.append(svg('text',{class:'graph-caption',x:layout.x+22,y:layout.y+31},`${group.name} · ${group.count}`));
  r.append(svg('text',{class:'graph-subcaption',x:layout.x+22,y:layout.y+53},group.short));
  const colW=(layout.w-28)/layout.cols,nodeW=colW-9;
  const rowH=layout.id==='beautiful'?45:layout.id==='unwholesome'?56:60;
  for(const [j,f] of factors.entries()){
   const col=j%layout.cols,row=Math.floor(j/layout.cols),x=layout.x+14+col*colW,y=layout.y+75+row*rowH;
   const active=!!m.vector[f.id],selected=selectedFactor===f.id;
   const g=svg('g',{class:'node'+(active?' on':'')+(selected?' selected':'')+(onlyActive&&!active?' hidden-node':''),role:'button',tabindex:'0','aria-label':`${f.id}. ${f.name} — ${active?'เกิดร่วม':'ไม่เกิดร่วม'}กับจิตขณะนี้`});
   g.style.setProperty('--node-color',group.color);g.style.setProperty('--glow-color',group.color+'66');
   g.append(svg('rect',{x,y,width:nodeW,height:36,rx:7}));
   g.append(svg('text',{class:'number',x:x+7,y:y+23},String(f.id).padStart(2,'0')));
   const txt=f.name.length>(layout.cols===5?12:19)?f.name.slice(0,layout.cols===5?10:17)+'…':f.name;
   g.append(svg('text',{x:x+27,y:y+23,'font-size':12},txt));
   g.append(svg('title',{},`${f.name} (${f.pali}) — ${f.meaning}`));
   g.addEventListener('click',()=>selectFactor(f.id));
   g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectFactor(f.id);}});
   r.append(g);
  }
  n.append(r);
 }
 const hub=svg('g',{'aria-hidden':'true'});hub.append(svg('circle',{class:'hub-circle',cx:600,cy:406,r:62}));hub.append(svg('text',{class:'hub-text',x:600,y:400},'CITTA'));hub.append(svg('text',{class:'hub-text',x:600,y:424,'font-size':'13'},`${m.activeCount} / 52`));n.append(hub);
 $('graphActivated').textContent=`${m.activeCount} / 52 ACTIVE`;
 $('selectActiveBtn').textContent=onlyActive?'แสดงโหนดทั้งหมด':'เน้นเฉพาะที่ทำงาน';
}
$('selectActiveBtn').addEventListener('click',()=>{onlyActive=!onlyActive;renderGraph(process.moments[current]);});
function selectFactor(id){selectedFactor=id;renderGraph(process.moments[current]);renderFactors(process.moments[current]);renderFactorDetail(process.moments[current]);}
function renderFactors(m){
 const text=dom.factorSearch.value.trim().toLocaleLowerCase('th'),filter=dom.factorGroup.value;
 dom.factorList.replaceChildren();
 for(const group of GROUPS){
  if(filter!=='all'&&filter!==group.id)continue;
  const factors=FACTORS.filter(f=>f.group===group.id&&(!text||`${f.id} ${f.name} ${f.pali} ${f.meaning}`.toLowerCase().includes(text)));
  if(!factors.length)continue;
  const h=document.createElement('div');h.className='factor-group-title';h.style.setProperty('--group-color',group.color);
  h.textContent=`${group.name} · ${factors.length}/${group.count}`;dom.factorList.append(h);
  const box=document.createElement('div');box.className='factor-items';
  for(const f of factors){const btn=document.createElement('button');btn.type='button';btn.className='factor-item'+(m.vector[f.id]?' on':'')+(selectedFactor===f.id?' selected':'');btn.title=`${f.name} — ${f.meaning}`;
   const i=document.createElement('span');i.className='factor-id';i.textContent=String(f.id).padStart(2,'0');
   const name=document.createElement('span');name.className='factor-name';name.textContent=f.name;
   const dot=document.createElement('i');dot.className='factor-indicator';btn.append(i,name,dot);btn.addEventListener('click',()=>selectFactor(f.id));box.append(btn);
  }
  dom.factorList.append(box);
 }
 if(!dom.factorList.children.length){const msg=document.createElement('p');msg.textContent='ไม่พบเจตสิกตามคำค้น';msg.className='field-caption';dom.factorList.append(msg);}
}
function renderFactorDetail(m){
 const f=BY_ID.get(selectedFactor),group=GROUPS.find(g=>g.id===f.group),active=m.vector[f.id];
 $('detailNumber').textContent=String(f.id).padStart(2,'0');
 $('detailName').textContent=f.name;
 $('detailPali').textContent=f.pali;
 $('detailMeaning').textContent=f.meaning;
 const state=associationStatus(m.cittaId,f.id);
 const labels={required:'ต้องเกิด',optional:'อาจเกิด',forbidden:'เกิดไม่ได้'};
 $('detailState').textContent=`${active?'● เกิดร่วม':'○ ไม่เกิดร่วม'}ในขณะนี้ · ตามตาราง: ${labels[state]}`;
 $('detailState').classList.toggle('off',!active);
 $('detailGroup').textContent=`หมวด ${f.subgroup} · ${group.name}`;
}
for(const key of ['factorSearch','factorGroup'])dom[key].addEventListener(key==='factorSearch'?'input':'change',()=>renderFactors(process.moments[current]));
matrixUi=mountMatrix();
conditionsUi=mountConditions(()=>process,()=>current,setCurrent);
$('inspectMomentMatrix').addEventListener('click',()=>matrixUi.selectCitta(process.moments[current].cittaId));
updateInputs();validateProcess(process);render();