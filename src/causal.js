import {buildSenseCourse} from './vithi-strength.js';
/**
 * An explicitly scoped condition-to-transition planner for teaching cases.
 * Textual patterns: Abhidhammatthasaṅgaha Ch IV (vīthi) and Bodhi et al. Ch IV.
 * The mapping from a user's hypothetical attention/cue to one particular javana
 * is a MODEL ASSUMPTION, never a claim to diagnose mental states or karmic fruit.
 * Reference: https://thaipitaka.gitlab.io/sangaha/chapter_4.htm
 */
export const CAUSAL_SOURCES=Object.freeze({
 vithi:{title:'อภิธัมมัตถสังคหะ บทที่ 4 (กระบวนวิถี)',tier:'คู่มืออรรถาธิบาย',url:'https://thaipitaka.gitlab.io/sangaha/chapter_4.htm'},
 resultants:{title:'A Comprehensive Manual of Abhidhamma IV §17 (วิบากและอารมณ์)',tier:'คู่มืออรรถาธิบาย',url:'https://www.bps.lk/olib/bp/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf'},
 patthana:{title:'Paṭṭhāna Paccayaniddesa · คัมภีร์ปัฏฐาน (นิทเทสปัจจัย)',tier:'พระไตรปิฎก · ต้นฉบับบาลี',url:'https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html'},
 scenario:{title:'เงื่อนไขสมมติที่ผู้ใช้เลือก (ไม่ใช่กฎจากพระไตรปิฎก)',tier:'สมมติฐานของแบบจำลอง',url:null}
});

const INTENSITIES=new Set(['very-great','great','slight','very-slight']);
const QUALITIES=new Set(['desirable','very-desirable','undesirable']);
const CUES=new Set(['attraction','aversion','doubt']);
const ATTENTION=new Set(['wise','unwise']);

export const CAUSAL_DEFAULTS=Object.freeze({
 objectQuality:'desirable',selectionMode:'manual',attention:'wise',reactionCue:'aversion',
 nextAttention:'wise',nextReactionCue:'aversion',processMode:'normal',faculties:'average'
});

export function validateCausalInputs(config){
 if(!QUALITIES.has(config.objectQuality))throw new RangeError('Unknown object quality');
 if(!['manual','guided'].includes(config.selectionMode))throw new RangeError('Unknown javana decision mode');
 if(!['normal','appana-first'].includes(config.processMode))throw new RangeError('Unknown process mode');
 if(!['average','keen'].includes(config.faculties))throw new RangeError('Unknown faculty strength');
 if(!ATTENTION.has(config.attention)||!ATTENTION.has(config.nextAttention))throw new RangeError('Unknown attention condition');
 if(!CUES.has(config.reactionCue)||!CUES.has(config.nextReactionCue))throw new RangeError('Unknown tendency cue');
 return true;
}

/**
 * Epistemic boundary: a conditional pattern is not a prediction.
 * The user enters a hypothetical object quality. Without a known person's
 * conditions (plane, rebirth-resultant, applicable object and preceding javana),
 * these fields DO NOT identify a real resultant or registration citta.
 */
export const CAUSAL_EPISTEMIC=Object.freeze({
 CONDITIONAL:'CONDITIONAL_ON_SCENARIO',
 UNKNOWN:'UNKNOWN',
 NOT_INFERRED:'NOT_INFERRED'
});

export function chooseResultant(stage,door,objectQuality){
 if(!QUALITIES.has(objectQuality))throw new RangeError('Unknown object quality');
 const doors=['eye','ear','nose','tongue','body'];
 if(stage==='sense'){
  const idx=doors.indexOf(door);
  if(idx<0)throw new RangeError('Sense consciousness requires a five-door input');
  return {
   cittaId:(objectQuality==='undesirable'?13:20)+idx,
   rule:'resultant-sense',basis:'commentarial-pattern',epistemicStatus:CAUSAL_EPISTEMIC.CONDITIONAL,
   scenarioPremises:['ชนิดอารมณ์ที่ผู้ใช้ระบุ ไม่ใช่ผลตรวจกรรมจริง'],
   reason:'กรณีสมมติ: ถ้าลักษณะอารมณ์และทวารตรงตามเงื่อนไขในคู่มือ จึงเลือกตัวอย่างวิญญาณนี้ ไม่ใช่การพยากรณ์วิบากจริง',source:CAUSAL_SOURCES.resultants
  };
 }
 if(stage==='receive')return {
  cittaId:objectQuality==='undesirable'?18:25,rule:'resultant-receiving',basis:'commentarial-pattern',epistemicStatus:CAUSAL_EPISTEMIC.CONDITIONAL,
  scenarioPremises:['อารมณ์และทวารจากฉากศึกษา'],
  reason:'ตามรูปแบบวิบากของกรณีศึกษา เมื่อสมมติคุณลักษณะอารมณ์ไว้แล้ว ไม่สามารถสรุปวิบากจริงของบุคคลได้',source:CAUSAL_SOURCES.resultants
 };
 if(['investigate','register'].includes(stage))return {
  cittaId:objectQuality==='undesirable'?19:objectQuality==='very-desirable'?26:27,
  rule:stage==='register'?'registration-example-unknown':'resultant-investigating',
  basis:stage==='register'?'scenario-assumption':'commentarial-pattern',
  epistemicStatus:stage==='register'?CAUSAL_EPISTEMIC.UNKNOWN:CAUSAL_EPISTEMIC.CONDITIONAL,
  scenarioPremises:['ชนิดอารมณ์สมมติ','ไม่ได้ตรวจภูมิ บุคคล และวิบากปฏิสนธิ'],
  reason:stage==='register'?
   'UNKNOWN: อารมณ์ที่ระบุยังไม่พอกำหนดจิตตทาลัมพนะได้แน่ชัด รหัสจิตนี้เป็นตัวอย่างที่แสดงโครงสร้างเท่านั้น':
   'แสดงสันตีรณะตามรูปแบบวิบากแบบมีเงื่อนไขจากอารมณ์ที่สมมติ ไม่ใช่ผลวิเคราะห์จิตจริง',source:CAUSAL_SOURCES.resultants
 };
 throw new RangeError(`Stage ${stage} has no resultant-selection rule`);
}

/**
 * Given only a hypothetical wise/unwise attention and reaction cue we cannot
 * derive a single citta (nor optional cetasikas). Person type (including arahant
 * kiriya), prompting, mental feeling, view, knowledge and preceding conditions
 * are missing. Never silently map these cues to citta #31, #1, #9 or #11.
 * Manual source: Comprehensive Manual of Abhidhamma, III §§9-10, IV §§4-5.
 */
export function assessJavanaPremises(config,cycle=1){
 const attention=cycle===2?config.nextAttention:config.attention;
 const cue=cycle===2?config.nextReactionCue:config.reactionCue;
 if(!ATTENTION.has(attention)||!CUES.has(cue))throw new RangeError('Unknown hypothetical javana conditions');
 return Object.freeze({status:CAUSAL_EPISTEMIC.UNKNOWN,exactCittaId:null,
  exactCetasikaIds:null,attention,cue,
  missing:['ภูมิและฐานะของบุคคล (รวมกรณีพระอรหันต์ที่เป็นกิริยาจิต)',
   'เวทนา ญาณ ทิฏฐิ และความเป็นสสังขาริก/อสังขาริก',
   'เหตุปัจจัยที่ทำให้เจตสิกแปรผันเกิดหรือไม่เกิด'],
  explanation:'โยนิโส/อโยนิโสมนสิการและแนวโน้มสมมติยังไม่ระบุเลขจิตชนิดเดียวได้ตามตาราง 121 จิต',
  source:CAUSAL_SOURCES.vithi});
}

/** No guided automatic prediction. Render ONLY the separately declared preset. */
export function chooseJavana(config,cycle=1){
 const follow=cycle===2;
 const preset=follow&&config.nextJavana!=='same'?config.nextJavana:config.javana;
 if(!preset || preset==='same')throw new RangeError('Explicit example javana is required');
 const inference=config.selectionMode==='guided'?assessJavanaPremises(config,cycle):
  {status:CAUSAL_EPISTEMIC.NOT_INFERRED,exactCittaId:null,exactCetasikaIds:null,
   explanation:'ใช้กรณีศึกษาเลือกเอง โดยไม่ขอให้โปรแกรมอนุมานจิตจากเหตุสมมติ'};
 return {preset,rule:config.selectionMode==='guided'?'javana-unresolved-example-only':'user-selected-javana',
  basis:'scenario-assumption',epistemicStatus:inference.status,
  chosenBy:'user-example-preset',inference,source:CAUSAL_SOURCES.scenario,
  reason:config.selectionMode==='guided'?
   'UNKNOWN: เงื่อนไขที่กำหนดยังไม่ระบุชวนจิตได้แน่ชัด ขณะจิตด้านล่างมาจากรายการตัวอย่างที่ผู้ใช้เลือกเอง ไม่ใช่ผลอนุมานของระบบ':
   'ตัวอย่างชวนจิตที่เลือกจากรายการด้วยตนเอง ไม่ได้ใช้คำนวณจิตจริงของบุคคล'};
}

const step=(stage,why,rule,basis='commentarial-pattern')=>({stage,why,rule,basis,source:basis==='commentarial-pattern'?CAUSAL_SOURCES.vithi:CAUSAL_SOURCES.scenario});

/**
 * Transition state machine. It derives each next event from prior state and
 * declared hypothetical conditions. No pre-written list of 17 moments.
 */
export function planVithi(config,kind){
 if(kind!=='mind-door'&&kind!=='five-door')throw new RangeError('Unknown process kind');
 if(kind==='five-door'&&!INTENSITIES.has(config.intensity))throw new RangeError('Unknown object grade');
 if(kind==='mind-door'&&!['clear','obscure'].includes(config.mindClarity))throw new RangeError('Unknown mind clarity');
 const mind=kind==='mind-door',course=mind?null:buildSenseCourse(config);
 let stage=mind?'vibrate':'past',repeats=0;
 const events=[];
 while(stage!==null){
  if(events.length>40)throw Error('Transition planner safety limit');
  events.push(step(stage,events.length===0?'จุดเริ่มกรณีศึกษา':'เกิดตามเงื่อนไขลำดับวิถี', 'sequence'));
  repeats++;
  let next=null,rule='sequence',why='ลำดับกิจในวิถีจิต';
  if(stage==='past'){if(repeats<course.pastCount){next='past';rule='object-grade';why='ภวังค์ที่ล่วงไปในแบบตัวอย่างของระดับอารมณ์ที่เลือก';}else{next='vibrate';rule='object-impact';why='อารมณ์ที่กำหนดเป็นปัจจัยให้ภวังคจิตไหวในแบบตัวอย่าง';}}
  else if(stage==='vibrate'){
   if(!mind&&config.intensity==='very-slight'&&repeats<2){next='vibrate';rule='very-slight';why='อารมณ์อ่อนมาก: ยังไม่เข้าสู่วิถีจิต';}
   else if(!mind&&config.intensity==='very-slight'){next=null;rule='very-slight';why='สิ้นสุดที่ภวังค์ไหว ไม่มีชวนจิต';}
   else{next='arrest';rule='bhavanga-cut';why='ภวังค์ถูกตัดเพื่อเข้าสู่วิถีตามกรณีที่กำหนด';}
  }
  else if(stage==='arrest'){next=mind?'mind_advert':'five_advert';rule='door-adverting';why='ทวารที่เลือกกำหนดชนิดอาวัชชนะ';}
  else if(stage==='five_advert'){next='sense';rule='five-door-order';}
  else if(stage==='sense'){next='receive';rule='five-door-order';}
  else if(stage==='receive'){next='investigate';rule='five-door-order';}
  else if(stage==='investigate'){next='determine';rule='five-door-order';}
  else if(stage==='mind_advert'){next='javana';rule='mind-door-order';}
  else if(stage==='determine'){
   if(config.intensity==='slight'){
    if(repeats<course.determiningCount){next='determine';rule='slight-object';why='อารมณ์ปริตตารมณ์ ไม่ถึงชวนะ แสดงโวฏฐัพพนะซ้ำในตัวอย่าง';}
    else{next=null;rule='slight-object';why='วาระนี้สิ้นสุดก่อนชวนจิต';}
   }else{next='javana';rule='javana-enter';why='วาระนี้มีอารมณ์ถึงระดับที่ชวนจิตเกิดได้ในแบบตัวอย่าง';}
  }
  else if(stage==='javana'){
   if(repeats<7){next='javana';rule='javana-seven';why='ชวนจิตปกติชุดนี้ต่อเนื่องตามลำดับเจ็ดขณะ';}
   else if((mind&&config.mindClarity==='clear')||(!mind&&config.intensity==='very-great')){next='register';rule='registration-present';why='ความชัด/ระดับอารมณ์ที่กำหนดอยู่ในกรณีศึกษาที่มีตทาลัมพนะ';}
   else{next=null;rule='registration-absent';why='ความชัด/ระดับอารมณ์ที่กำหนดอยู่ในกรณีศึกษาที่ไม่มีตทาลัมพนะ';}
  }
  else if(stage==='register'){
   if(repeats<2){next='register';rule='registration-two';why='ตทาลัมพนะขณะถัดไปของกรณีศึกษานี้';}
   else{next=null;rule='registration-end';why='วาระนี้สิ้นสุดหลังตทาลัมพนะ';}
  }
  if(next!==stage)repeats=0;
  events[events.length-1].next=next;
  events[events.length-1].transition={rule,why,
   basis:['registration-present','registration-absent','registration-two','object-grade','very-slight','slight-object'].includes(rule)?
     'scenario-assumption':'commentarial-pattern',
   epistemicStatus:['registration-present','registration-absent','registration-two'].includes(rule)?CAUSAL_EPISTEMIC.CONDITIONAL:CAUSAL_EPISTEMIC.NOT_INFERRED,
   source:CAUSAL_SOURCES.vithi};
  stage=next;
 }
 if(!mind&&events.map(e=>e.stage).join('|')!==course.stages.join('|'))throw Error('Sense transition diverged from Chapter IV grade pattern');
 return Object.freeze(events);
}

/** One selected special workflow: FIRST RŪPĀVACARA JHĀNA in a study scenario.
 * Chapter IV §16, §19: 3 or 4 knowledge-associated preliminary kāma javanas,
 * one initial appanā, no tadārammaṇa. This is NOT a meditative attainment detector.
 * Other special courses (paths/fruits, death/rebirth etc) remain unimplemented.
 */
export function planAppana(config){
 if(config.processMode!=='appana-first')throw new RangeError('Not an appanā case');
 if(config.door!=='mind')throw new RangeError('First absorption example needs mind door');
 if(!['average','keen'].includes(config.faculties))throw new RangeError('Unknown faculty strength');
 const sequence=['vibrate','arrest','mind_advert',
  ...(config.faculties==='average'?['preparation']:[]),'access','conformity','change_lineage','absorption','return'];
 return Object.freeze(sequence.map((stage,index)=>({stage,index,
  why:stage==='absorption'?'เลือกกรณีศึกษาปฐมฌานจิตดวงแรก มิใช่ยืนยันว่าบุคคลจริงเข้าฌาน':
      stage==='return'?'หลังอัปปนาวาระนี้กลับสู่ภวังค์ในกรณีศึกษา':'ลำดับวิถีอัปปนาในคู่มืออรรถาธิบาย',
  rule:stage==='absorption'?'first-jhana-single':'appana-order',
  basis:stage==='absorption'?'scenario-assumption':'commentarial-pattern',
  source:stage==='absorption'?CAUSAL_SOURCES.scenario:CAUSAL_SOURCES.vithi,
  next:sequence[index+1]??null,
  transition:sequence[index+1]?{rule:'appana-stage-order',why:'ลำดับวิถีอัปปนาตามกรณีศึกษา',basis:'commentarial-pattern',source:CAUSAL_SOURCES.vithi}:null
 })));
}

export function summarizeTransition(plan,index){
 const current=plan[index],previous=plan[index-1];
 if(!current)throw new RangeError('Transition event not in plan');
 return Object.freeze({
  prior:previous?.stage??null,stage:current.stage,rule:previous?.transition?.rule??'initial-conditions',
  reason:previous?.transition?.why??'เริ่มจากเงื่อนไขของฉากจำลอง',
  basis:previous?.transition?.basis??'scenario-assumption',
  source:previous?.transition?.source??CAUSAL_SOURCES.scenario
 });
}

/** This is deliberately not a blanket engine for all 24 Paṭṭhāna conditions. */
export const COVERAGE=Object.freeze({
 canonicalMatrix:'89/121 cittas × 52 cetasikas',
 normalVithi:'Five-door object grades and mind-door clear/obscure instructional cases',
 workedFactors:18,
 otherFactors:'six paccaya names remain UNKNOWN/reference-only; all 18 are partial patterns',
 specialVithi:'one sample: first rūpāvacara jhāna (appanā) with average/keen preparatory route. NOT magga/phala, cuti/paṭisandhi',
 inferredKamma:'not supported'
});
