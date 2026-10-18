/**
 * An explicitly scoped condition-to-transition planner for teaching cases.
 * Textual patterns: Abhidhammatthasaṅgaha Ch IV (vīthi) and Bodhi et al. Ch IV.
 * The mapping from a user's hypothetical attention/cue to one particular javana
 * is a MODEL ASSUMPTION, never a claim to diagnose mental states or karmic fruit.
 * Reference: https://thaipitaka.gitlab.io/sangaha/chapter_4.htm
 */
export const CAUSAL_SOURCES=Object.freeze({
 vithi:{title:'อภิธัมมัตถสังคหะ บทที่ 4 (กระบวนวิถี)',tier:'คู่มืออรรถาธิบาย',url:'https://thaipitaka.gitlab.io/sangaha/chapter_4.htm'},
 resultants:{title:'A Comprehensive Manual of Abhidhamma IV §17 (วิบากและอารมณ์)',tier:'คู่มืออรรถาธิบาย',url:'https://www.dhammatalks.net/Books16/Bhikkhu_Bodhi-Abhidhamma.pdf'},
 patthana:{title:'ปัฏฐาน พระอภิธรรมปิฎก (ชื่อเหตุปัจจัย 24)',tier:'พระไตรปิฎก · ภูมิหลัง',url:'https://www.abhidhamma.org/study/conditionality-of-life/index.html'},
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

/** Canonical constraints select among *illustrative* resultant cittas.
 * Affective "desirability" is entered as an assumed characteristic of the
 * hypothetical object, NOT inferred from a real person's experience.
 */
export function chooseResultant(stage,door,objectQuality){
 if(!QUALITIES.has(objectQuality))throw new RangeError('Unknown object quality');
 const doors=['eye','ear','nose','tongue','body'];
 if(stage==='sense'){
  const idx=doors.indexOf(door);
  if(idx<0)throw new RangeError('Sense consciousness requires a five-door input');
  return {
   cittaId:(objectQuality==='undesirable'?13:20)+idx,
   rule:'resultant-sense',basis:'commentarial-pattern',
   reason:'วิญญาณทางทวารนี้เป็นอกุศลวิบากหรือกุศลวิบากตามคุณลักษณะอารมณ์ที่กำหนดในกรณีศึกษา',source:CAUSAL_SOURCES.resultants
  };
 }
 if(stage==='receive')return {
  cittaId:objectQuality==='undesirable'?18:25,rule:'resultant-receiving',basis:'commentarial-pattern',
  reason:'สัมปฏิจฉนะเป็นวิบากฝ่ายเดียวกับปัญจวิญญาณในกรณีศึกษานี้',source:CAUSAL_SOURCES.resultants
 };
 if(['investigate','register'].includes(stage))return {
  cittaId:objectQuality==='undesirable'?19:objectQuality==='very-desirable'?26:27,
  rule:stage==='register'?'resultant-registration':'resultant-investigating',basis:'commentarial-pattern',
  reason:'เลือกตัวอย่างวิบากตามอิฏฐารมณ์/อนิฏฐารมณ์ และระดับพิเศษที่สัมพันธ์กับโสมนัส; ภูมิและบุคคลยังไม่ถูกจำลอง',source:CAUSAL_SOURCES.resultants
 };
 throw new RangeError(`Stage ${stage} has no resultant-selection rule`);
}

/** Condition-guided javana = explicit illustrative decision, not deterministic Paṭṭhāna. */
export function chooseJavana(config,cycle=1){
 const follow=cycle===2;
 if(config.selectionMode==='manual'){
  const preset=follow&&config.nextJavana!=='same'?config.nextJavana:config.javana;
  return {preset,rule:'user-selected-javana',basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario,
   reason:'ผู้ใช้กำหนดชวนจิตกรณีศึกษา ไม่ได้คำนวณความเป็นกุศล/อกุศลของจิตบุคคลจริง'};
 }
 const attention=follow?config.nextAttention:config.attention;
 const cue=follow?config.nextReactionCue:config.reactionCue;
 if(!ATTENTION.has(attention)||!CUES.has(cue))throw new RangeError('Missing hypothetical conditions for guided javana');
 const preset=attention==='wise'?'kusala_wisdom':({attraction:'lobha_view',aversion:'dosa',doubt:'moha_doubt'})[cue];
 return {preset,rule:'illustrative-attention-javana',basis:'scenario-assumption',source:CAUSAL_SOURCES.scenario,
  reason:attention==='wise'?
   'กำหนดสมมติฐานว่ามีโยนิโสมนสิการ จึงเลือกหนึ่งตัวอย่างของมหากุศลประกอบปัญญา; ไม่ใช่ผลที่จำเป็นเสมอ':
   `กำหนดสมมติฐานว่ามีอโยนิโสมนสิการพร้อมแนวโน้ม “${{attraction:'ติดข้อง',aversion:'ขัดเคือง',doubt:'ลังเลสงสัย'}[cue]}” จึงเลือกหนึ่งตัวอย่างของอกุศล; ไม่ใช่การทำนาย`
 };
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
 const mind=kind==='mind-door',pastCount={'very-great':1,'great':2,'slight':6,'very-slight':15};
 let stage=mind?'vibrate':'past',repeats=0;
 const events=[];
 while(stage!==null){
  if(events.length>40)throw Error('Transition planner safety limit');
  events.push(step(stage,events.length===0?'จุดเริ่มกรณีศึกษา':'เกิดตามเงื่อนไขลำดับวิถี', 'sequence'));
  repeats++;
  let next=null,rule='sequence',why='ลำดับกิจในวิถีจิต';
  if(stage==='past'){if(repeats<pastCount[config.intensity]){next='past';rule='object-grade';why='ภวังค์ที่ล่วงไปในแบบตัวอย่างของระดับอารมณ์ที่เลือก';}else{next='vibrate';rule='object-impact';why='อารมณ์ที่กำหนดเป็นปัจจัยให้ภวังคจิตไหวในแบบตัวอย่าง';}}
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
    if(repeats<3){next='determine';rule='slight-object';why='อารมณ์ปริตตารมณ์ ไม่ถึงชวนะ แสดงโวฏฐัพพนะซ้ำในตัวอย่าง';}
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
  events[events.length-1].transition={rule,why,basis:'commentarial-pattern',source:CAUSAL_SOURCES.vithi};
  stage=next;
 }
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
 workedFactors:12,
 otherFactors:'reference-only / require more data',
 specialVithi:'one sample: first rūpāvacara jhāna (appanā) with average/keen preparatory route. NOT magga/phala, cuti/paṭisandhi',
 inferredKamma:'not supported'
});
