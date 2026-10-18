import {FACTORS, IDS, JAVANAS, DOORS} from './data.js';

const span=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const uniq=ids=>[...new Set(ids)].sort((a,b)=>a-b);
const union=(...parts)=>uniq(parts.flat());
const UNIVERSAL=IDS.universal;
const BEAUTIFUL=IDS.beautifulCommon;
const AKUSALA=IDS.akusalaCommon;
const OCC_ADVERT=[8,9,10];
const OCC_MIND_ADVERT=[8,9,10,11];
const OCC_BHAVANGA=[8,9,10,11,13];

/** Educational representative citta–cetasika configurations, not the entire 89/121 matrix. */
export const TYPE_RULES = Object.freeze({
 bhavanga:{name:'มหาวิบากอุเบกขาประกอบปัญญา (ตัวอย่างภวังค์)',family:'vipaka',ids:union(UNIVERSAL,OCC_BHAVANGA,BEAUTIFUL,[52])},
 five_advert:{name:'ปัญจทวาราวัชชนจิต',family:'kiriya',ids:union(UNIVERSAL,OCC_ADVERT)},
 mind_advert:{name:'มโนทวาราวัชชนจิต / โวฏฐัพพนจิต',family:'kiriya',ids:union(UNIVERSAL,OCC_MIND_ADVERT)},
 sense:{name:'ทวิปัญจวิญญาณ (แบบจำลองอุเบกขา)',family:'vipaka',ids:[...UNIVERSAL]},
 sense_body:{name:'กายวิญญาณ (ตัวอย่างสุขเวทนา)',family:'vipaka',ids:[...UNIVERSAL]},
 receive:{name:'สัมปฏิจฉนจิต',family:'vipaka',ids:union(UNIVERSAL,OCC_ADVERT)},
 investigate:{name:'สันตีรณจิตอุเบกขา',family:'vipaka',ids:union(UNIVERSAL,OCC_ADVERT)},
 register:{name:'ตทาลัมพนจิต (ตัวอย่างสันตีรณวิบากอุเบกขา)',family:'vipaka',ids:union(UNIVERSAL,OCC_ADVERT)}
});

export function javanaType(id){
 const preset=JAVANAS.find(s=>s.id===id);
 if(!preset) throw new RangeError(`Unknown javana ${id}`);
 let ids, name, family;
 switch(preset.base){
 case 'kusala':
  ids=union(UNIVERSAL,span(8,13),BEAUTIFUL,[52],preset.extra);
  name='กามาวจรมหากุศลจิต โสมนัส ประกอบญาณ'; family='kusala';break;
 case 'kusala-neutral':
  ids=union(UNIVERSAL,[8,9,10,11,13],BEAUTIFUL,[52],preset.extra);
  name='กามาวจรมหากุศลจิต อุเบกขา ประกอบญาณ';family='kusala';break;
 case 'lobha':
  ids=union(UNIVERSAL,span(8,13),AKUSALA,[18],preset.extra);
  name='โลภมูลจิต โสมนัส';family='akusala';break;
 case 'dosa':
  ids=union(UNIVERSAL,[8,9,10,11,13],AKUSALA,[21],preset.extra);
  name='โทสมูลจิต โทมนัส';family='akusala';break;
 case 'moha-doubt':
  ids=union(UNIVERSAL,[8,9,11],AKUSALA,[27]);
  name='โมหมูลจิต สัมปยุตด้วยวิจิกิจฉา';family='akusala';break;
 case 'moha-restless':
  ids=union(UNIVERSAL,[8,9,10,11],AKUSALA);
  name='โมหมูลจิต สัมปยุตด้วยอุทธัจจะ';family='akusala';break;
 default:throw new RangeError(`Unknown javana base: ${preset.base}`);
 }
 const rule={name,family,ids};
 validateAssociations(rule);
 return {...rule,preset};
}

export function validateAssociations(rule){
 const ids=rule.ids;
 if(!Array.isArray(ids)||ids.length===0||new Set(ids).size!==ids.length)throw Error('Duplicate / missing cetasika');
 if(ids.some(id=>!FACTORS.some(f=>f.id===id)))throw Error('Cetasika id out of range');
 if(UNIVERSAL.some(id=>!ids.includes(id)))throw Error('All cittas require universal seven');
 const a=ids.some(id=>id>=14&&id<=27),b=ids.some(id=>id>=28&&id<=52);
 if(a&&b)throw Error('Unwholesome and beautiful factors cannot co-arise');
 if(rule.family==='akusala'&&AKUSALA.some(id=>!ids.includes(id)))throw Error('Unwholesome common four required');
 if((rule.family==='kusala'||b)&&BEAUTIFUL.some(id=>!ids.includes(id)))throw Error('Beautiful common nineteen required');
 const cannot=[[18,21],[19,20],[10,27],[12,21],[12,27],[22,23],[22,24],[23,24],[50,51],[47,48],[47,49],[48,49]];
 for(const [x,y] of cannot){if(ids.includes(x)&&ids.includes(y))throw Error(`Incompatible cetasikas: ${x} and ${y}`);}
 if(ids.includes(25)!==ids.includes(26))throw Error('Thīna and middha must co-arise');
 if(rule.family==='akusala'&& !ids.some(id=>[18,21,27].includes(id)) && ids.includes(12))throw Error('Moha-rooted citta cannot include pīti');
 return true;
}

const STAGES={
 past:['อตีตภวังค์','Atīta-bhavaṅga','ภวังคจิตที่ผ่านไปก่อนวิถี','bhavanga'],
 vibrate:['ภวังคจลนะ','Bhavaṅga-calana','ภวังค์ไหวเมื่ออารมณ์มากระทบ','bhavanga'],
 arrest:['ภวังคุปัจเฉทะ','Bhavaṅgupaccheda','ภวังค์ขาดก่อนเข้าวิถี','bhavanga'],
 five_advert:['ปัญจทวาราวัชชนะ','Pañcadvārāvajjana','จิตหันไปสู่อารมณ์ทางปัญจทวาร','five_advert'],
 sense:['ปัญจวิญญาณ','Pañcaviññāṇa','การรู้อารมณ์ทางทวารที่เลือก','sense'],
 receive:['สัมปฏิจฉนะ','Sampaṭicchana','รับอารมณ์','receive'],
 investigate:['สันตีรณะ','Santīraṇa','พิจารณาอารมณ์','investigate'],
 determine:['โวฏฐัพพนะ','Votthapana','กำหนดอารมณ์','mind_advert'],
 mind_advert:['มโนทวาราวัชชนะ','Manodvārāvajjana','หันไปสู่อารมณ์ทางมโนทวาร','mind_advert'],
 javana:['ชวนจิต','Javana','เสพอารมณ์ในช่วงชวนะ','javana'],
 register:['ตทาลัมพนะ','Tadārammaṇa','รับอารมณ์ต่อจากชวนะตามเหตุปัจจัย','register'],
 return:['ภวังค์ระหว่างวิถี','Bhavaṅga','ภวังค์กลับมาคั่นระหว่างวิถี','bhavanga']
};
export const DEFAULT_CONFIG=Object.freeze({door:'eye',intensity:'very-great',mindClarity:'clear',javana:'kusala_wisdom',followMind:false});

function createMoment(stage,config,cycle,order,javanaOrdinal=0){
 const [name,pali,description,type]=STAGES[stage];
 const door=DOORS.find(d=>d.id===config.door);
 const base=type==='javana'?javanaType(config.javana):TYPE_RULES[type==='sense'&&config.door==='body'?'sense_body':type];
 const active=[...base.ids];
 const vector=Object.fromEntries(FACTORS.map(f=>[String(f.id),active.includes(f.id)]));
 const bhavanga=type==='bhavanga';
 return {
  id:`${cycle}-${order}`,cycle,order,stage,phase:stage==='javana'?'javana':stage==='register'?'registration':bhavanga?'bhavanga':'cognitive',
  javanaOrdinal,name,pali,description,citta:stage==='sense'?door.sense:base.name,
  family:base.family,active,vector,activeCount:active.length,
  object:bhavanga?'อารมณ์ของภวังค์ (ไม่ใช่อารมณ์ใหม่)':cycle===2?`ธรรมารมณ์ที่สืบเนื่องจาก${door.object}`:door.object,
  objectKind:bhavanga?'bhavanga':'process',
  note:stage==='javana'?(javanaType(config.javana).preset.description):'',
  threeSubmoments:['อุปปาทะ','ฐิติ','ภังคะ']
 };
}
export function createProcess(user={}){
 const config={...DEFAULT_CONFIG,...user};
 if(!DOORS.find(d=>d.id===config.door))throw new RangeError('Unknown sense door');
 if(!JAVANAS.find(j=>j.id===config.javana))throw new RangeError('Unknown javana preset');
 if(!['very-great','great','slight','very-slight'].includes(config.intensity))throw new RangeError('Unknown object grade');
 if(!['clear','obscure'].includes(config.mindClarity))throw new RangeError('Unknown mind clarity');
 const moments=[],cycles=[];
 let currentCycle=0,javanaOrdinal=0;
 function push(stage){
  const moment=createMoment(stage,config,currentCycle,moments.length+1,stage==='javana'?++javanaOrdinal:0);
  validateAssociations({family:moment.family,ids:moment.active});
  moments.push(moment);
 }
 function repeat(stage,n){for(let i=0;i<n;i++)push(stage);}
 function senseProcess(){
  currentCycle=1;javanaOrdinal=0;
  const start=moments.length;
  const pastCount={'very-great':1,'great':2,'slight':6,'very-slight':15}[config.intensity];
  repeat('past',pastCount);
  if(config.intensity==='very-slight'){
   repeat('vibrate',2);
  } else {
   push('vibrate');push('arrest');push('five_advert');push('sense');push('receive');push('investigate');
   if(config.intensity==='slight')repeat('determine',3);
   else {
    push('determine');repeat('javana',7);
    if(config.intensity==='very-great')repeat('register',2);
   }
  }
  cycles.push({id:1,door:config.door,kind:'five-door',start,end:moments.length-1,
    title:'ปัญจทวารวิถี',grade:config.intensity,
    note:config.intensity==='very-slight'?'ไม่มีวิถีจิตเกิดขึ้น มีเพียงภวังค์ไหว':config.intensity==='slight'?'โวฏฐัพพนะ 3 ขณะ ไม่มีชวนะ':config.intensity==='great'?'ไม่มีตทาลัมพนะ':'วิถีเต็ม 17 ขณะ'});
 }
 function mindProcess(){
  currentCycle=config.door==='mind'?1:2;javanaOrdinal=0;
  const start=moments.length;
  push('vibrate');push('arrest');push('mind_advert');repeat('javana',7);
  if(config.mindClarity==='clear')repeat('register',2);
  cycles.push({id:currentCycle,door:'mind',kind:'mind-door',start,end:moments.length-1,
    title:'มโนทวารวิถี',grade:config.mindClarity,note:config.mindClarity==='clear'?'ธรรมารมณ์ชัด มีตทาลัมพนะ 2 ขณะ':'ธรรมารมณ์ไม่ชัด ไม่มีตทาลัมพนะ'});
 }
 if(config.door==='mind')mindProcess();
 else{
  senseProcess();
  if(config.followMind&&config.intensity!=='very-slight'){
   currentCycle=0;push('return');mindProcess();
  }
 }
 return {version:'0.1.0',educational:true,config,moments,cycles,
  factorCount:FACTORS.length,profileCount:JAVANAS.length,
  caveat:'การจำลองเชิงการศึกษา ไม่ใช่การตรวจวัดจิตจริง ไม่ใช่ตารางสัมปโยคจิต 89/121 ประเภททั้งหมด และความเร็วภาพไม่ใช่ระยะเวลาจิตตามคัมภีร์'};
}
export function validateProcess(process){
 if(process.factorCount!==52)throw Error('Expected 52 cetasikas');
 for(const [i,m] of process.moments.entries()){
  if(m.order!==i+1)throw Error('Non-sequential moments');
  if(Object.keys(m.vector).length!==52)throw Error('Each moment must carry 52 variables');
  if(m.active.length!==Object.values(m.vector).filter(Boolean).length)throw Error('Activation mismatch');
  if(m.active.some(id=>m.vector[String(id)]!==true))throw Error('Vector mismatch');
  validateAssociations({family:m.family,ids:m.active});
 }
 for(const cycle of process.cycles){
  const subset=process.moments.slice(cycle.start,cycle.end+1);
  const javanas=subset.filter(m=>m.stage==='javana');
  const expected=cycle.grade==='slight'||cycle.grade==='very-slight'?0:7;
  if(javanas.length!==expected)throw Error(`Unexpected javana count in ${cycle.title}`);
  if(javanas.length&&javanas.some(j=>j.citta!==javanas[0].citta || j.active.join(',')!==javanas[0].active.join(',')))throw Error('Javana run must use one citta type');
  const regs=subset.filter(m=>m.stage==='register');
  const expectedRegs=['very-great','clear'].includes(cycle.grade)?2:0;
  if(regs.length!==expectedRegs)throw Error('Unexpected registration count');
  if(cycle.grade==='very-great'&&subset.length!==17)throw Error('Full five-door should be 17 moments');
 }
 return true;
}
