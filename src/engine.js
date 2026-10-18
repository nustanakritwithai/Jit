/** Vīthi: teaching scenarios instantiated from the 121-class sampayoga matrix. */
import {FACTORS, IDS, JAVANAS, DOORS} from './data.js';
import {getSampayoga,resolveSampayoga} from './association.js';
import {buildConditionality,validateConditionality} from './conditions.js';

const format=(id,extras=[])=>{
 const m=resolveSampayoga(id,extras);
 return {name:m.citta.label,family:m.citta.quality,ids:[...m.active],cittaId:id,selectedExtras:[...m.chosen]};
};
const JAVANA_CITTAS=Object.freeze({
 kusala_wisdom:[31,[]],kusala_compassion:[31,[50]],kusala_joy:[31,[51]],
 kusala_speech:[31,[47]],kusala_action:[31,[48]],kusala_livelihood:[31,[49]],
 kusala_neutral:[35,[]],lobha_view:[1,[]],lobha_conceit:[3,[20]],
 lobha_sloth:[4,[25,26]],dosa:[9,[]],dosa_envy:[9,[22]],
 dosa_stingy:[9,[23]],dosa_remorse:[9,[24]],
 moha_doubt:[11,[]],moha_restless:[12,[]]
});
/** Explicit citta ID + selected conditional adjuncts, no random selection. */
export function javanaType(id){
 const preset=JAVANAS.find(p=>p.id===id),pair=JAVANA_CITTAS[id];
 if(!preset||!pair)throw new RangeError(`Unknown javana ${id}`);
 return {...format(pair[0],pair[1]),preset};
}

export const TYPE_RULES=Object.freeze({
 bhavanga:format(43),five_advert:format(28),mind_advert:format(29),
 sense:format(20),sense_body:format(24),receive:format(25),
 investigate:format(27),register:format(27)
});
/** General consistency guard; when cittaId supplied, exact canonical matrix is enforced. */
export function validateAssociations(rule){
 const ids=rule?.ids;
 if(!Array.isArray(ids)||ids.length===0||new Set(ids).size!==ids.length)throw Error('Duplicate / missing cetasika');
 if(ids.some(id=>!Number.isInteger(id)||id<1||id>52))throw Error('Cetasika ID out of range');
 for(const id of IDS.universal)if(!ids.includes(id))throw Error('All cittas require universal seven');
 const bad=ids.some(id=>id>=14&&id<=27),good=ids.some(id=>id>=28&&id<=52);
 if(bad&&good)throw Error('Unwholesome and beautiful factors cannot co-arise');
 if(rule.family==='akusala'&&IDS.akusalaCommon.some(id=>!ids.includes(id)))throw Error('Unwholesome common four required');
 if((rule.family==='kusala'||good)&&IDS.beautifulCommon.some(id=>!ids.includes(id)))throw Error('Beautiful common nineteen required');
 if(ids.includes(25)!==ids.includes(26))throw Error('Thīna and middha must co-arise');
 for(const group of [[22,23,24],[50,51],[19,20],[18,21],[10,27]]){
  if(ids.filter(id=>group.includes(id)).length>1)throw Error(`Incompatible cetasikas: ${group.join(',')}`);
 }
 // In mundane consciousness abstinences are occasional and mutually exclusive;
 // in lokuttara consciousness all three are obligatorily associated.
 if(ids.filter(id=>[47,48,49].includes(id)).length>1 && !(rule.cittaId&&getSampayoga(rule.cittaId).realm==='lokuttara'))
  throw Error('Incompatible cetasikas: 47,48,49 outside lokuttara');
 if(rule.cittaId){
  const reference=getSampayoga(rule.cittaId);
  if(rule.family!==reference.quality)throw Error(`Wrong ethical quality for citta ${rule.cittaId}`);
  const optional=ids.filter(id=>reference.optional.includes(id));
  const canonical=resolveSampayoga(rule.cittaId,optional).active;
  if(canonical.length!==ids.length||canonical.some(id=>!ids.includes(id)))throw Error(`Citta ${rule.cittaId} differs from its sampayoga row`);
 }
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
 return:['ภวังค์ระหว่างวิถี','Bhavaṅga','ขณะภวังค์ที่จำลองเป็นสะพานแสดงการเกิดดับระหว่างสองวิถี','bhavanga']
};
export const DEFAULT_CONFIG=Object.freeze({door:'eye',intensity:'very-great',mindClarity:'clear',javana:'kusala_wisdom',followMind:false,nextJavana:'same',interludeCount:2});

function newMoment(stage,config,cycle,order,javanaOrdinal=0){
 const [name,pali,description,type]=STAGES[stage];
 const door=DOORS.find(d=>d.id===config.door);
 let classification;
 if(type==='javana')classification=javanaType(cycle===2&&config.nextJavana!=='same'?config.nextJavana:config.javana);
 else if(type==='sense')classification=format(20+DOORS.findIndex(d=>d.id===config.door));
 else classification=TYPE_RULES[type];
 const {ids:active,cittaId,family}=classification;
 const bhavanga=type==='bhavanga';
 const objectId=bhavanga?'continuum-bhavanga':cycle===2?'mental-representation-2':'sensory-object-1';
 return {
  id:`${cycle}-${order}`,cycle,order,stage,phase:stage==='javana'?'javana':stage==='register'?'registration':bhavanga?'bhavanga':'cognitive',
  javanaOrdinal,name,pali,description,cittaId,
  citta:classification.name,citta89:getSampayoga(cittaId).id89,family,
  feeling:getSampayoga(cittaId).feeling,active:[...active],chosenExtras:[...classification.selectedExtras],
  vector:Object.fromEntries(FACTORS.map(f=>[String(f.id),active.includes(f.id)])),activeCount:active.length,
  objectId,object:bhavanga?'อารมณ์ภวังค์ (ต่างจากอารมณ์วิถี)':cycle===2?`ธรรมารมณ์ที่สืบเนื่องจาก${door.object}`:door.object,
  objectKind:bhavanga?'bhavanga':cycle===2?'mental-representation':'process',
  sourceObjectId:cycle===2&&!bhavanga?'sensory-object-1':null,
  note:stage==='javana'?(classification.preset.description):'ชนิดจิตที่เลือกเป็นกรณีศึกษา; ไม่ใช่การระบุว่าจิตจริงของผู้ชมเป็นชนิดนี้',
  threeSubmoments:['อุปปาทะ','ฐิติ','ภังคะ']
 };
}
export function createProcess(user={}){
 const config={...DEFAULT_CONFIG,...user};
 if(!DOORS.some(d=>d.id===config.door))throw new RangeError('Unknown sense door');
 if(!JAVANAS.some(j=>j.id===config.javana))throw new RangeError('Unknown javana preset');
 if(!JAVANAS.some(j=>j.id===config.nextJavana)&&config.nextJavana!=='same')throw new RangeError('Unknown following javana');
 if(!['very-great','great','slight','very-slight'].includes(config.intensity))throw new RangeError('Unknown object grade');
 if(!['clear','obscure'].includes(config.mindClarity))throw new RangeError('Unknown mind clarity');
 if(!Number.isInteger(config.interludeCount)||config.interludeCount<1||config.interludeCount>8)throw new RangeError('Interlude must be 1–8 pedagogical bhavangas');
 const moments=[],cycles=[];
 let currentCycle=0,javanaOrdinal=0;
 const push=stage=>{
  const m=newMoment(stage,config,currentCycle,moments.length+1,stage==='javana'?++javanaOrdinal:0);
  validateAssociations({cittaId:m.cittaId,family:m.family,ids:m.active});moments.push(m);
 };
 const repeat=(stage,n)=>{for(let k=0;k<n;k++)push(stage);};
 const senseProcess=()=>{
  currentCycle=1;javanaOrdinal=0;
  const start=moments.length,pastCount={'very-great':1,'great':2,'slight':6,'very-slight':15}[config.intensity];
  repeat('past',pastCount);
  if(config.intensity==='very-slight')repeat('vibrate',2);
  else{
   push('vibrate');push('arrest');push('five_advert');push('sense');push('receive');push('investigate');
   if(config.intensity==='slight')repeat('determine',3);
   else{push('determine');repeat('javana',7);if(config.intensity==='very-great')repeat('register',2);}
  }
  cycles.push({id:1,door:config.door,kind:'five-door',start,end:moments.length-1,
   title:'ปัญจทวารวิถี',grade:config.intensity,
   note:config.intensity==='very-slight'?'ภวังค์ไหวเท่านั้น; ยังไม่เกิดวิถี':config.intensity==='slight'?'หยุดก่อนชวนจิต':config.intensity==='great'?'เกิดชวนจิตแต่ไม่มีตทาลัมพนะ':'วิถีเต็ม 17 ขณะ'});
 };
 const mindProcess=()=>{
  currentCycle=config.door==='mind'?1:2;javanaOrdinal=0;
  const start=moments.length;
  push('vibrate');push('arrest');push('mind_advert');repeat('javana',7);
  if(config.mindClarity==='clear')repeat('register',2);
  cycles.push({id:currentCycle,door:'mind',kind:'mind-door',start,end:moments.length-1,
   title:'มโนทวารวิถี',grade:config.mindClarity,
   note:config.mindClarity==='clear'?'ธรรมารมณ์ชัด มีตทาลัมพนะ 2 ขณะ':'ธรรมารมณ์ไม่ชัด ไม่มีตทาลัมพนะ'});
 };
 if(config.door==='mind')mindProcess();
 else{
  senseProcess();
  if(config.followMind&&config.intensity!=='very-slight'){
   currentCycle=0;repeat('return',config.interludeCount);mindProcess();
  }
 }
 const conditions=buildConditionality(moments,cycles);
 const result={version:'0.2.0',educational:true,config,moments,cycles,conditions,
  factorCount:FACTORS.length,associationRows:121,profileCount:JAVANAS.length,
  caveat:'การจำลองนี้เลือกจิตบางประเภทที่ถูกต้องตามตารางสัมปโยค แต่ไม่ได้จำลองทุกกรณีวิถีจิต บุคคล ภูมิ ฌาน หรือปัฏฐาน 24 ปัจจัยทั้งหมด; จำนวนภวังค์คั่นที่เลือกใช้เพื่อแสดงเหตุการณ์เท่านั้น'};
 validateProcess(result);
 return result;
}
export function validateProcess(process){
 if(process.factorCount!==52)throw Error('Expected 52 cetasikas');
 for(const [i,m] of process.moments.entries()){
  if(m.order!==i+1)throw Error('Non-sequential moments');
  if(Object.keys(m.vector).length!==52)throw Error('Each moment requires 52 variables');
  if(m.active.length!==Object.values(m.vector).filter(Boolean).length)throw Error('Activation mismatch');
  if(m.active.some(id=>m.vector[String(id)]!==true))throw Error('Vector mismatch');
  validateAssociations({cittaId:m.cittaId,family:m.family,ids:m.active});
 }
 for(const cycle of process.cycles){
  const subset=process.moments.slice(cycle.start,cycle.end+1);
  const javanas=subset.filter(m=>m.stage==='javana');
  const expected=cycle.grade==='slight'||cycle.grade==='very-slight'?0:7;
  if(javanas.length!==expected)throw Error(`Unexpected javana count in ${cycle.title}`);
  if(javanas.length&&javanas.some(j=>j.cittaId!==javanas[0].cittaId||j.active.join(',')!==javanas[0].active.join(',')))throw Error('Normal javana run must use one citta configuration');
  const regs=subset.filter(m=>m.stage==='register'),expectedRegs=['very-great','clear'].includes(cycle.grade)?2:0;
  if(regs.length!==expectedRegs)throw Error('Unexpected registration count');
  if(cycle.grade==='very-great'&&subset.length!==17)throw Error('Full five-door should be 17 moments');
 }
 validateConditionality(process);
 return true;
}