/** Vīthi: teaching scenarios instantiated from the 121-class sampayoga matrix. */
import {FACTORS, IDS, JAVANAS, DOORS} from './data.js';
import {getSampayoga,resolveSampayoga} from './association.js';
import {buildConditionality,validateConditionality,PACCAYA_24} from './conditions.js';
import {CAUSAL_DEFAULTS,CAUSAL_SOURCES,validateCausalInputs,chooseResultant,chooseJavana,planVithi,planAppana,summarizeTransition} from './causal.js';

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
 return:['ภวังค์ระหว่างวิถี','Bhavaṅga','ขณะภวังค์ที่จำลองเป็นสะพานแสดงการเกิดดับระหว่างสองวิถี','bhavanga'],
 preparation:['บริกรรม','Parikamma','ชวนะเตรียมเข้าสู่อัปปนาในตัวอย่างผู้มีอินทรีย์ปานกลาง','appana-preliminary'],
 access:['อุปจาร','Upacāra','ชวนะใกล้เข้าสู่อัปปนา (ตัวอย่าง)','appana-preliminary'],
 conformity:['อนุโลม','Anuloma','ชวนะอนุโลมกับจิตที่สูงขึ้น (ตัวอย่าง)','appana-preliminary'],
 change_lineage:['โคตรภู','Gotrabhū','ชวนะเปลี่ยนโคตรก่อนอัปปนาในกรณีศึกษานี้','appana-preliminary'],
 absorption:['ปฐมฌานจิต (ตัวอย่าง)','Paṭhamajjhāna','ตัวอย่างรูปาวจรกุศลจิตปฐมฌานครั้งแรกหนึ่งขณะ','appana']
};
export const DEFAULT_CONFIG=Object.freeze({door:'eye',intensity:'very-great',mindClarity:'clear',javana:'kusala_wisdom',followMind:false,nextJavana:'same',interludeCount:2,...CAUSAL_DEFAULTS});

/** Create one moment from a planned stage and the entered hypothetical conditions. */
function newMoment(stage,config,cycle,order,javanaOrdinal=0,planned=null){
 const info=STAGES[stage];
 if(!info)throw new RangeError(`Unknown cognitive stage ${stage}`);
 const [name,pali,description,type]=info;
 const door=DOORS.find(d=>d.id===config.door);
 let classification,selection;
 if(type==='javana'){
  selection=chooseJavana(config,cycle);
  classification=javanaType(selection.preset);
 }else if(type==='appana-preliminary'){
  classification=format(31); // one wisdom-associated somanassa mahākusala configuration
  selection={rule:'appana-preliminary',basis:'commentarial-pattern',source:CAUSAL_SOURCES.vithi,
   reason:'ตัวอย่างชวนะประกอบปัญญาที่นำเข้าสู่รูปาวจรปฐมฌาน; เงื่อนไขสมาธิจริงไม่ได้ถูกวัด'};
 }else if(type==='appana'){
  classification=format(55); // rūpāvacara kusala, first-jhāna citta
  selection={rule:'example-first-rupa-jhana',basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario,
   reason:'เลือกสาธิตปฐมฌานครั้งแรกหนึ่งขณะเท่านั้น ไม่อ้างว่าระบบตรวจพบการบรรลุฌาน'};
 }else if(['sense','receive','investigate'].includes(type)){
  selection=chooseResultant(type==='investigate'?'investigate':type,config.door,config.objectQuality);
  classification=format(selection.cittaId);
 }else if(type==='register'){
  // Tadārammaṇa varies by plane, individual, and preceding javana.
  // This is an explicit pedagogical simplification, not a universal mapping.
  selection={...chooseResultant('register',config.door,config.objectQuality),basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario,
   reason:'ตทาลัมพนะในแบบจำลองเลือกหนึ่งตัวอย่างตามคุณลักษณะอารมณ์ ผู้เรียนต้องตรวจเงื่อนไขภูมิ บุคคล และชวนจิตเพิ่มเติม'};
  classification=format(selection.cittaId);
 }else{
  classification=TYPE_RULES[type];
  selection=type==='bhavanga'?
   {rule:'example-bhavanga',basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario,reason:'กำหนดชนิดภวังค์เป็นตัวอย่าง เพราะไม่ได้จำลองปฏิสนธิและกรรมของบุคคล'}:
   {rule:'door-function',basis:'commentarial-pattern',source:CAUSAL_SOURCES.vithi,reason:'ประเภทจิตสัมพันธ์กับกิจและตำแหน่งในวิถีตามคู่มืออรรถาธิบาย'};
 }
 const {ids:active,cittaId,family}=classification;
 const bhavanga=type==='bhavanga';
 const objectId=bhavanga?'continuum-bhavanga':type.startsWith('appana')?'appana-meditation-object':cycle===2?'mental-representation-2':config.door==='mind'?'mental-object-1':'sensory-object-1';
 const specialJavana=type==='appana'||type==='appana-preliminary';
 const phase=stage==='javana'||specialJavana?'javana':stage==='register'?'registration':bhavanga?'bhavanga':'cognitive';
 const audit={selection:{...selection,inputs:
  ['sense','receive','investigate','register'].includes(type)?{objectQuality:config.objectQuality,door:config.door}:
  type==='javana'?{selectionMode:config.selectionMode,attention:cycle===2?config.nextAttention:config.attention,
   reactionCue:cycle===2?config.nextReactionCue:config.reactionCue}:{}},
  transition:planned?.incoming??{prior:null,stage,rule:'scenario-start',reason:'เริ่มวาระตามเงื่อนไขที่กำหนด',basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario}};
 return {
  id:`${cycle}-${order}`,cycle,order,stage,phase,javanaOrdinal,name,pali,description,cittaId,
  citta:classification.name,citta89:getSampayoga(cittaId).id89,family,
  feeling:getSampayoga(cittaId).feeling,active:[...active],chosenExtras:[...classification.selectedExtras],
  vector:Object.fromEntries(FACTORS.map(f=>[String(f.id),active.includes(f.id)])),activeCount:active.length,
  objectId,object:bhavanga?'อารมณ์ภวังค์ (ต่างจากอารมณ์วิถี)':specialJavana?'อารมณ์กรรมฐานที่กำหนดเป็นสมมติฐาน':cycle===2?`ธรรมารมณ์ที่สืบเนื่องจาก${door.object}`:door.object,
  objectKind:bhavanga?'bhavanga':specialJavana?'meditation-sign':cycle===2?'mental-representation':'process',
  sourceObjectId:cycle===2&&!bhavanga?'sensory-object-1':null,
  note:stage==='javana'?classification.preset.description:
   specialJavana?'กรณีศึกษาอัปปนาวาระจากคู่มืออรรถาธิบาย ไม่ได้วัดหรือยืนยันสมาธิของผู้ใช้':
   'ชนิดจิตที่เลือกเป็นกรณีศึกษา; ไม่ใช่การระบุว่าจิตจริงของผู้ชมเป็นชนิดนี้',
  ruleAudit:audit,threeSubmoments:['อุปปาทะ','ฐิติ','ภังคะ']
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
 validateCausalInputs(config);
 if(config.processMode==='appana-first'&&config.door!=='mind')throw new RangeError('Appana first requires mind door');
 const moments=[],cycles=[],transitionRules=[];
 let currentCycle=0,javanaOrdinal=0;
 const push=(stage,planned)=>{
  const m=newMoment(stage,config,currentCycle,moments.length+1,stage==='javana'?++javanaOrdinal:0,planned);
  validateAssociations({cittaId:m.cittaId,family:m.family,ids:m.active});
  moments.push(m);
  transitionRules.push({...m.ruleAudit.transition,toMoment:m.id,selectionRule:m.ruleAudit.selection.rule,
    selectionBasis:m.ruleAudit.selection.basis});
 };
 const pushPlan=plan=>plan.forEach((event,i)=>push(event.stage,{incoming:summarizeTransition(plan,i)}));
 const mindProcess=()=>{
  currentCycle=config.door==='mind'?1:2;javanaOrdinal=0;
  const start=moments.length;
  const plan=planVithi(config,'mind-door');pushPlan(plan);
  cycles.push({id:currentCycle,door:'mind',kind:'mind-door',start,end:moments.length-1,
   title:'มโนทวารวิถี',grade:config.mindClarity,
   note:config.mindClarity==='clear'?'ธรรมารมณ์ชัด มีตทาลัมพนะ 2 ขณะ':'ธรรมารมณ์ไม่ชัด ไม่มีตทาลัมพนะ'});
 };
 const senseProcess=()=>{
  currentCycle=1;javanaOrdinal=0;
  const start=moments.length;
  pushPlan(planVithi(config,'five-door'));
  cycles.push({id:1,door:config.door,kind:'five-door',start,end:moments.length-1,
   title:'ปัญจทวารวิถี',grade:config.intensity,
   note:config.intensity==='very-slight'?'ภวังค์ไหวเท่านั้น; ยังไม่เกิดวิถี':config.intensity==='slight'?'หยุดก่อนชวนจิต':config.intensity==='great'?'เกิดชวนจิตแต่ไม่มีตทาลัมพนะ':'วิถีเต็ม 17 ขณะ'});
 };
 const absorptionProcess=()=>{
  currentCycle=1;javanaOrdinal=0;
  const start=moments.length;
  pushPlan(planAppana(config));
  cycles.push({id:1,door:'mind',kind:'appana-demo',start,end:moments.length-1,
   title:'อัปปนาวาระ — ปฐมฌานครั้งแรก (ตัวอย่าง)',grade:config.faculties,
   note:'แสดงชวนะเตรียม 3/4 ขณะ ตามอินทรีย์สมมติ → รูปาวจรกุศลปฐมฌาน 1 ขณะ → ภวังค์'});
 };
 if(config.processMode==='appana-first')absorptionProcess();
 else if(config.door==='mind')mindProcess();
 else{
  senseProcess();
  if(config.followMind&&config.intensity!=='very-slight'){
   currentCycle=0;
   for(let i=0;i<config.interludeCount;i++)push('return',{incoming:{prior:moments.at(-1)?.stage??null,stage:'return',
    rule:'bhavanga-interlude',reason:'ผู้ใช้กำหนดจำนวนภวังค์คั่นในกรณีศึกษา',basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario}});
   mindProcess();
  }
 }
 const conditions=buildConditionality(moments,cycles);
 const result={version:'0.4.0',educational:true,config,moments,cycles,conditions,transitionRules,
  factorCount:FACTORS.length,associationRows:121,profileCount:JAVANAS.length,
  coverage:{registry24:PACCAYA_24.length,illustratedConditions:conditions.coverage.illustrated,unknownConditions:conditions.coverage.referenceOnly,specialWorkflows:['first-rupa-jhana-demo'],
   unsupported:['full Paṭṭhāna 24-case solver','lokuttara magga-phala','death/relinking','complete meditation attainment sequences']},
  caveat:'การเลือกชวนจิตตามเงื่อนไขเป็นสมมติฐานเพื่อการสอน ไม่ใช่ผลจำเป็นตามเหตุปัจจัย 24 และไม่ใช่เครื่องพยากรณ์กรรมหรือวัดฌาน'};
 validateProcess(result);
 return result;
}

export function validateProcess(process){
 if(process.factorCount!==52)throw Error('Expected 52 cetasikas');
 if(process.transitionRules?.length!==process.moments.length)throw Error('Missing causal audit for each moment');
 for(const [i,m] of process.moments.entries()){
  if(m.order!==i+1)throw Error('Non-sequential moments');
  if(Object.keys(m.vector).length!==52)throw Error('Each moment requires 52 variables');
  if(m.active.length!==Object.values(m.vector).filter(Boolean).length)throw Error('Activation mismatch');
  if(m.active.some(id=>m.vector[String(id)]!==true))throw Error('Vector mismatch');
  if(!['commentarial-pattern','scenario-assumption'].includes(m.ruleAudit?.selection?.basis))throw Error('Causal evidence must distinguish source from assumption');
  validateAssociations({cittaId:m.cittaId,family:m.family,ids:m.active});
 }
 for(const cycle of process.cycles){
  const subset=process.moments.slice(cycle.start,cycle.end+1);
  const javanas=subset.filter(m=>m.stage==='javana');
  if(cycle.kind==='appana-demo'){
   const preliminary=subset.filter(m=>['preparation','access','conformity','change_lineage'].includes(m.stage));
   const absorptions=subset.filter(m=>m.stage==='absorption');
   if(preliminary.length!==(cycle.grade==='average'?4:3)||preliminary.some(m=>m.cittaId!==31))throw Error('Invalid appana preliminary javanas');
   if(absorptions.length!==1||absorptions[0].cittaId!==55)throw Error('First appana example must show single first jhana');
   if(subset.filter(m=>m.stage==='register').length||subset.at(-1).stage!=='return')throw Error('Appana example has no registration and must end in bhavanga');
   continue;
  }
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
