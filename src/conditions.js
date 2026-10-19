/**
 * Paṭṭhāna condition EXPLORER, NOT a 24-condition causal solver.
 * Source of each definition: Paṭṭhāna, Paccayuddesa/Paccayaniddesa, §1–24.
 * Canonical Pāli: https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html
 * Parallel English translation: https://dhammatalks.net/suttacentral/sc2016/sc/en/patthana1.1.html
 * Chapter commentary for limitations: Nina van Gorkom, The Conditionality of Life.
 * Model scope: associated immaterial aggregates (citta+cetasika), adjacent
 * conscious moments, and a first-jhāna teaching example. No rūpa/event karma.
 */export const PATTHANA_CANONICAL=Object.freeze({
 title:'Paṭṭhāna · Nikkhepavāra · Paccayaniddesa (พระอภิธรรมปิฎก)',
 tier:'พระไตรปิฎก',
 pali:'https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html',
 english:'https://dhammatalks.net/suttacentral/sc2016/sc/en/patthana1.1.html'
});
export const CONDITIONAL_MANUAL=Object.freeze({
 title:'Nina van Gorkom, The Conditionality of Life (อรรถาธิบาย)',
 tier:'คำอธิบายสมัยใหม่',
 url:'https://www.abhidhamma.org/study/conditionality-of-life/index.html'
});

const PACCAYA_NAMES=[
 ['hetu','เหตุปัจจัย','รากทั้งหกเป็นปัจจัยแก่สหชาตธรรม'],
 ['arammana','อารัมมณปัจจัย','อารมณ์เป็นปัจจัยต่อจิตและเจตสิกที่รู้อารมณ์'],
 ['adhipati','อธิปติปัจจัย','ธรรมที่เป็นใหญ่หรืออารมณ์ที่ถือเป็นใหญ่เป็นปัจจัย'],
 ['anantara','อนันตรปัจจัย','จิตก่อนดับแล้วเกื้อหนุนจิตถัดไปโดยไม่มีจิตคั่น'],
 ['samanantara','สมนันตรปัจจัย','จิตก่อนเป็นปัจจัยให้จิตถัดไปเกิดตามลำดับ'],
 ['sahajata','สหชาตปัจจัย','ธรรมที่เกิดร่วมกันเป็นปัจจัย'],
 ['annamanna','อัญญมัญญปัจจัย','นามขันธ์ที่เกิดร่วมกันอาศัยกันและกัน'],
 ['nissaya','นิสสยปัจจัย','ธรรมที่เกิดร่วมกันเป็นที่อาศัยต่อกัน (รวมถึงรูปที่อาศัยในกรณีอื่น)'],
 ['upanissaya','อุปนิสสยปัจจัย','ปัจจัยหนุนอันมีกำลัง รวมถึงปัจจัยจากประสบการณ์ที่สั่งสม'],
 ['purejata','ปุเรชาตปัจจัย','รูปที่เกิดก่อนหนุนธรรมที่เกิดภายหลัง'],
 ['pacchajata','ปัจฉาชาตปัจจัย','นามที่เกิดทีหลังช่วยค้ำจุนรูปที่มีอยู่ก่อน'],
 ['asevana','อาเสวนปัจจัย','ชวนจิตที่เกิดก่อนหนุนชวนจิตที่ตามติดกันตามเงื่อนไข'],
 ['kamma','กัมมปัจจัย','เจตนาในขณะเดียวกันเป็นปัจจัย; ส่วนกรรมต่างขณะต้องมีข้อมูลเพิ่ม'],
 ['vipaka','วิปากปัจจัย','วิบากธรรมที่เกิดร่วมกันเป็นปัจจัยต่อกัน'],
 ['ahara','อาหารปัจจัย','ผัสสะ เจตนา และจิต เป็นอาหารฝ่ายนาม; อาหารรูปยังไม่จำลอง'],
 ['indriya','อินทริยปัจจัย','อินทรีย์ฝ่ายนามเป็นปัจจัยแก่ธรรมที่เกิดร่วม'],
 ['jhana','ฌานปัจจัย','องค์ฌานเป็นปัจจัย; ยกเว้นปัญจวิญญาณสิบดวง'],
 ['magga','มัคคปัจจัย','องค์มรรคฝ่ายถูกและฝ่ายผิดเป็นปัจจัยตามเงื่อนไขเฉพาะ'],
 ['sampayutta','สัมปยุตตปัจจัย','นามขันธ์ที่เกิดร่วมกันรู้อารมณ์เดียวกันเป็นปัจจัย'],
 ['vippayutta','วิปปยุตตปัจจัย','นามและรูปเกื้อหนุนกันโดยไม่ประกอบร่วม'],
 ['atthi','อัตถิปัจจัย','ธรรมที่ยังมีอยู่เป็นปัจจัยต่อสหชาตธรรม'],
 ['natthi','นัตถิปัจจัย','จิตก่อนที่เพิ่งดับเกื้อหนุนจิตถัดไป'],
 ['vigata','วิคตปัจจัย','จิตก่อนที่เพิ่งดับไปเป็นปัจจัยแก่จิตถัดไป'],
 ['avigata','อวิคตปัจจัย','ธรรมที่ยังไม่ดับเกื้อหนุนสหชาตธรรม']
];

// A mode of "illustrated" covers the EXACT listed mental relationship only,
// never all possible domains of the named paccaya. Unknown is NOT false.
const SUPPORTED=new Set([
 'hetu','arammana','anantara','samanantara','sahajata','annamanna',
 'nissaya','asevana','kamma','vipaka','ahara','indriya','jhana',
 'sampayutta','atthi','natthi','vigata','avigata'
]);
export const PACCAYA_24=Object.freeze(PACCAYA_NAMES.map(([id,name,description],i)=>Object.freeze({
 number:i+1,id,name,description,mode:SUPPORTED.has(id)?'illustrated':'reference-only',
 source:{...PATTHANA_CANONICAL,locator:`Paccayaniddesa §${i+1}`},
 limits:SUPPORTED.has(id)?'เฉพาะกรณีอธิบายจากนามธรรมที่มีในแบบจำลอง':id==='purejata'?'UNKNOWN ใน engine ฝ่ายนาม; มีตัวอย่างรูป–นามตามเงื่อนไขในหน้า Rūpa V0.7':'UNKNOWN: ยังไม่มีข้อมูลพอสำหรับตรวจการเกิดจริงในกรณีจำลอง'
})));
export const PACCAYA_BY_ID=new Map(PACCAYA_24.map(c=>[c.id,c]));
export const ROOT_IDS=Object.freeze([14,18,21,32,33,52]);
const FACULTY_IDS=Object.freeze([2,5,6,11,28,29,52]); // vedanā, samādhi, jīvitindriya, vīriya, saddhā, sati, paññā
const JHANA_IDS=Object.freeze([8,9,12,2,5]); // vitakka, vicāra, pīti, vedanā (appropriate feeling), ekaggatā
const TEN_SENSE_IDS=new Set([13,14,15,16,17,20,21,22,23,24]);
const APPANA_PRELIMINARY=new Set(['preparation','access','conformity','change_lineage']);

export function inferWithinMoment(m){
 const active=new Set(m.active);
 if([...Array(7)].some((_,i)=>!active.has(i+1)))throw Error('Missing universal factors');
 const roots=ROOT_IDS.filter(id=>active.has(id));
 const isFiveSense=TEN_SENSE_IDS.has(m.cittaId);
 const jhanaSupporters=isFiveSense?[]:JHANA_IDS.filter(id=>active.has(id)&&!(id===2&&(m.cittaId===9||m.cittaId===10)));
 const facultySupporters=FACULTY_IDS.filter(id=>active.has(id));
 // The source "citta" is explicitly NOT a cetasika/numbered factor.
 const detail={
  hetu:roots.length?{cetasikaIds:roots}:null,
  arammana:{objectId:m.objectId,sourceKind:'object; declared scenario object'},
  sahajata:{cetasikaIds:[...m.active],sourceKind:'co-arising mental aggregates'},
  annamanna:{cetasikaIds:[...m.active],sourceKind:'mutuality of associated nāmakkhandhas'},
  nissaya:{cetasikaIds:[...m.active],sourceKind:'co-nascent mental support ONLY'},
  sampayutta:{cetasikaIds:[...m.active],sourceKind:'associated mental aggregates; not material rūpa'},
  kamma:{cetasikaIds:[4],sourceKind:'conascent cetanā ONLY; not past-to-future karmic fruit'},
  vipaka:m.family==='vipaka'?{cetasikaIds:[...m.active],sourceKind:'associated resultant mental aggregates'}:null,
  ahara:{cetasikaIds:[1,4],includesCitta:true,sourceKind:'three mental nutriments; not edible food'},
  indriya:{cetasikaIds:facultySupporters,includesCitta:true,sourceKind:'mental faculties; not sensory rūpa faculties'},
  jhana:jhanaSupporters.length?{cetasikaIds:jhanaSupporters,sourceKind:'jhāna-factor condition, NOT attainment'}:null,
  atthi:{cetasikaIds:[...m.active],sourceKind:'co-nascent presence of mental aggregates'},
  avigata:{cetasikaIds:[...m.active],sourceKind:'co-nascent non-disappearance of mental aggregates'}
 };
 const entries=Object.entries(detail).filter(([,v])=>v!==null).map(([id,support])=>({
  id,condition:PACCAYA_BY_ID.get(id).name,scope:'within-moment:mental',
  source:PACCAYA_BY_ID.get(id).source,support,
  verdict:'applies-in-modeled-scope',basis:'canonical-definition'
 }));
 return {roots,details:entries,conditions:entries.map(e=>e.id),isFiveSense};
}

// Verify domain AND ethical category for repetition. Unlike ordinary 7 javanas,
// the final kāmāvacara kusala javana before first rūpa-jhāna can condition
// the next (higher-plane) jhāna-citta by āsevana-paccaya (Gorkom, Ch 11, p.73).
export function qualifiesAsRepetition(previous,current){
 if(!previous||!current||previous.cycle!==current.cycle)return false;
 if(previous.family!==current.family||!['kusala','akusala','kiriya'].includes(previous.family))return false;
 if(previous.cittaId>=82||current.cittaId>=82)return false; // supramundane sequences not evaluated here
 if(previous.stage==='javana'&&current.stage==='javana')return previous.cittaId===current.cittaId;
 if(APPANA_PRELIMINARY.has(previous.stage)&&APPANA_PRELIMINARY.has(current.stage))return previous.cittaId===31&&current.cittaId===31;
 if(previous.stage==='change_lineage'&&current.stage==='absorption')return previous.cittaId===31&&current.cittaId===55;
 return false;
}

export function buildConditionality(moments,cycles){
 const edges=[],inMoments=[];
 for(const [i,m] of moments.entries()){
  const within=inferWithinMoment(m);
  inMoments.push({momentId:m.id,index:i,cittaId:m.cittaId,roots:within.roots,
   causalAudit:m.ruleAudit,selectionRule:m.ruleAudit?.selection?.rule??null,
   selectionBasis:m.ruleAudit?.selection?.basis??'not-evaluated',
   objectId:m.objectId,object:m.object,factors:[...m.active],
   conditions:within.conditions,proofs:within.details,conditionStatus:PACCAYA_24.map(p=>({
    id:p.id,status:within.conditions.includes(p.id)?'applies-in-modeled-scope':
      ['hetu','vipaka','jhana'].includes(p.id)?'not-applicable-for-this-citta':
      ['anantara','samanantara','asevana','natthi','vigata'].includes(p.id)?'evaluate-at-incoming-edge':
      'unknown-or-out-of-scope'
   })),
   explanation:'เฉพาะสภาวธรรมฝ่ายนามที่เกิดร่วมกัน กฎรูป–นาม ภพ บุคคล และผลกรรมข้ามขณะยังไม่ใช่ส่วนที่ประเมิน'});
  if(i===0)continue;
  const previous=moments[i-1];
  const relations=['anantara','samanantara','natthi','vigata'];
  if(qualifiesAsRepetition(previous,m))relations.push('asevana');
  edges.push({from:previous.id,to:m.id,fromIndex:i-1,toIndex:i,
   fromCycle:previous.cycle,toCycle:m.cycle,crossCycle:previous.cycle!==m.cycle,
   relations,mode:'canonical-definition+commentarial-application',
   source:relations.includes('asevana')?{...PATTHANA_CANONICAL,locator:'Paccayaniddesa §12'}:{...PATTHANA_CANONICAL,locator:'Paccayaniddesa §§4–5,22–23'},
   explanation:relations.includes('asevana')?
    'ชวนจิตก่อนเป็นปัจจัยแก่ชวนจิตถัดไปด้วยอาเสวน; ใช้ได้ในกรณีข้ามกามภูมิไปรูปฌานเมื่อทั้งคู่เป็นกุศล':
    'จิตที่เพิ่งดับเกื้อหนุนจิตถัดไปด้วยอนันตร สมนันตร นัตถิ วิคต; ไม่ใช่การเชื่อมข้ามขณะ'});
 }
 const cycleTransitions=[];
 for(let i=1;i<cycles.length;i++){
  const prev=cycles[i-1],next=cycles[i];
  const prevMoment=moments[prev.end],nextMoment=moments[next.start];
  const interval=moments.slice(prev.end+1,next.start);
  cycleTransitions.push({fromCycle:prev.id,toCycle:next.id,fromMomentId:prevMoment?.id,toMomentId:nextMoment?.id,
   bhavangaCount:interval.filter(x=>x.stage==='return').length,
   fromObjectId:prevMoment?.objectId,toObjectId:nextMoment?.objectId,
   sameObjectId:prevMoment?.objectId===nextMoment?.objectId,
   modelLink:'ทางเชื่อมของเรื่องราวอารมณ์เป็นตัวอย่างจำลอง ไม่ใช่ปัจจัยพิเศษที่กระโดดข้ามภวังคจิต',
   confidence:'scenario-assumption',
   edgeIds:edges.filter(e=>e.fromIndex>=prev.end&&e.toIndex<=next.start).map(e=>`${e.from}->${e.to}`)});
 }
 return {version:'0.4.0',registry:PACCAYA_24,edges,inMoments,cycleTransitions,
  counts:{adjacent:edges.length,repetition:edges.filter(e=>e.relations.includes('asevana')).length,transitions:cycleTransitions.length},
  coverage:{catalog:PACCAYA_24.length,illustrated:PACCAYA_24.filter(p=>p.mode==='illustrated').length,
   referenceOnly:PACCAYA_24.filter(p=>p.mode==='reference-only').length,scope:'selected nama relations only'},
  disclaimer:'ชื่อครบ 24 แต่ไม่ได้จำลองปัฏฐาน 24 ปัจจัยครบทุกกรณี; ที่แสดงเพิ่มเติมเป็นปัจจัยเฉพาะฝ่ายนาม และส่วนรูป–นาม/กรรมข้ามขณะยังไม่ตัดสิน'};
}
export function explainConditions(model,index){
 const moment=model.inMoments[index];
 if(!moment)throw new RangeError('Unknown moment index');
 const incoming=model.edges.find(e=>e.toIndex===index)??null;
 return {moment,incoming,outgoing:model.edges.find(e=>e.fromIndex===index)??null,
  annotations:moment.conditions.map(id=>PACCAYA_BY_ID.get(id)),
  activeRoots:moment.roots,
  unknowns:moment.conditionStatus.filter(x=>x.status==='unknown-or-out-of-scope'),
  isRepetitionIncoming:!!incoming?.relations.includes('asevana')};
}
export function validateConditionality(process){
 const {moments,conditions,cycles}=process;
 if(!conditions||conditions.edges.length!==moments.length-1)throw Error('Temporal link count invalid');
 for(const [i,e] of conditions.edges.entries()){
  if(e.fromIndex!==i||e.toIndex!==i+1||moments[e.fromIndex].id!==e.from||moments[e.toIndex].id!==e.to)throw Error('Adjacency must not skip a citta');
  for(const name of ['anantara','samanantara','natthi','vigata'])if(!e.relations.includes(name))throw Error('Mandatory temporal condition missing');
  if(e.relations.includes('asevana')!==qualifiesAsRepetition(moments[e.fromIndex],moments[e.toIndex]))throw Error('Invalid / missing āsevana association');
  if(!e.source?.pali||!e.source.locator)throw Error('Temporal paccaya must include canonical citation');
 }
 for(const [i,m] of moments.entries()){
  const info=conditions.inMoments[i],expect=inferWithinMoment(m);
  if(info?.momentId!==m.id||info.factors.length!==m.active.length)throw Error('Within-moment condition invalid');
  if(info.conditions.join()!==expect.conditions.join())throw Error('Unsupported within-moment claim');
  if(info.proofs.length!==info.conditions.length||info.proofs.some((proof,n)=>
   !proof.source?.locator||!proof.source?.pali||
   proof.id!==expect.details[n].id||proof.source.locator!==expect.details[n].source.locator||
   JSON.stringify(proof.support)!==JSON.stringify(expect.details[n].support)))throw Error('Missing or tampered proof for conditional rule');
  if(info.conditionStatus.length!==24||info.conditionStatus.some(x=>!x.status))throw Error('Incomplete paccaya-status matrix');
 }
 if(conditions.cycleTransitions.length!==Math.max(0,cycles.length-1))throw Error('Missing cross-process transitions');
 return true;
}
