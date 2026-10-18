/**
 * Conditional relations for *selected, explicitly modeled* interactions.
 * Full registry follows Abhidhammatthasaṅgaha chapter VIII, Table 8.2;
 * implementation covers only relationships justified by the event model.
 * A register of 24 is not a claim that all 24 are computationally simulated.
 */
const PACCAYA_NAMES=[
 ['hetu','เหตุปัจจัย','รากฝ่ายกุศล/อกุศลที่เกิดร่วมเป็นปัจจัย'],
 ['arammana','อารัมมณปัจจัย','อารมณ์เป็นปัจจัยต่อจิตและเจตสิกที่รู้อารมณ์'],
 ['adhipati','อธิปติปัจจัย','สภาวะที่เป็นใหญ่เป็นปัจจัย'],
 ['anantara','อนันตรปัจจัย','ขณะก่อนดับแล้วเป็นปัจจัยให้ขณะต่อไปเกิดโดยไม่มีขณะจิตคั่น'],
 ['samanantara','สมนันตรปัจจัย','จิตต่อเนื่องกันตามลำดับที่มีแบบแผน'],
 ['sahajata','สหชาตปัจจัย','จิตและเจตสิกที่เกิดร่วมกันเป็นปัจจัย'],
 ['annamanna','อัญญมัญญปัจจัย','สภาวธรรมเกิดร่วมอาศัยซึ่งกันและกัน'],
 ['nissaya','นิสสยปัจจัย','สิ่งที่เป็นที่อาศัยรองรับ'],
 ['upanissaya','อุปนิสสยปัจจัย','ปัจจัยหนุนที่มีกำลัง'],
 ['purejata','ปุเรชาตปัจจัย','ธรรมที่เกิดก่อนหนุนธรรมที่เกิดภายหลัง'],
 ['pacchajata','ปัจฉาชาตปัจจัย','ธรรมที่เกิดทีหลังหนุนสิ่งที่มีอยู่ก่อน'],
 ['asevana','อาเสวนปัจจัย','ชวนจิตก่อนหนุนชวนจิตที่ตามติดกัน'],
 ['kamma','กัมมปัจจัย','เจตนาในขณะเดียวกัน หรือกรรมต่างขณะเป็นปัจจัย'],
 ['vipaka','วิปากปัจจัย','วิบากธรรมหนุนสหชาตธรรม'],
 ['ahara','อาหารปัจจัย','อาหารรูป/นามเป็นปัจจัย'],
 ['indriya','อินทริยปัจจัย','อินทรีย์เป็นปัจจัย'],
 ['jhana','ฌานปัจจัย','องค์ฌานเป็นปัจจัย'],
 ['magga','มัคคปัจจัย','องค์มรรคเป็นปัจจัย'],
 ['sampayutta','สัมปยุตตปัจจัย','จิตเจตสิกที่ประกอบร่วมกันเป็นปัจจัย'],
 ['vippayutta','วิปปยุตตปัจจัย','ธรรมที่ไม่ประกอบร่วมกันเป็นปัจจัยตามเงื่อนไข'],
 ['atthi','อัตถิปัจจัย','ภาวะที่มีอยู่เป็นปัจจัย'],
 ['natthi','นัตถิปัจจัย','การดับไปแล้วเปิดโอกาสให้จิตดวงต่อไปเกิด'],
 ['vigata','วิคตปัจจัย','การสิ้นไปของจิตก่อนเป็นปัจจัย'],
 ['avigata','อวิคตปัจจัย','ภาวะที่ยังไม่ดับเป็นปัจจัย']
];
const SUPPORTED=new Set(['hetu','arammana','anantara','samanantara','sahajata','annamanna','asevana','kamma','vipaka','sampayutta','natthi','vigata']);
export const PACCAYA_24=Object.freeze(PACCAYA_NAMES.map(([id,name,description],i)=>Object.freeze({number:i+1,id,name,description,mode:SUPPORTED.has(id)?'illustrated':'reference-only'})));
export const PACCAYA_BY_ID=new Map(PACCAYA_24.map(c=>[c.id,c]));
const ROOT_IDS=[14,18,21,32,33,52];

/** Works across explicit events, never shortcuts a non-adjacent pair. */
export function buildConditionality(moments,cycles){
 const edges=[];
 const inMoments=[];
 for(const [i,m] of moments.entries()){
  const rootIds=m.active.filter(id=>ROOT_IDS.includes(id));
  inMoments.push({momentId:m.id,index:i,cittaId:m.cittaId,roots:rootIds,
   objectId:m.objectId,object:m.object,
   factors:[...m.active],
   conditions:[...new Set(['arammana','sahajata','annamanna','sampayutta','kamma',...(rootIds.length?['hetu']:[]),...(m.family==='vipaka'?['vipaka']:[])])],
   explanation:'ภายในหนึ่งขณะ: จิตและเจตสิกเกิดร่วมกัน รู้อารมณ์เดียวกัน; เจตนามีอยู่ทุกขณะ แต่ไม่ใช่ทุกขณะก่อกรรมใหม่ที่มีผลในอนาคต'});
  if(i===0)continue;
  const previous=moments[i-1];
  const relations=['anantara','samanantara','natthi','vigata'];
  if(previous.stage==='javana'&&m.stage==='javana'&&previous.cycle===m.cycle&&
     previous.cittaId===m.cittaId&&['akusala','kusala','kiriya'].includes(m.family)&&m.cittaId<82){
   relations.push('asevana');
  }
  edges.push({from:previous.id,to:m.id,fromIndex:i-1,toIndex:i,fromCycle:previous.cycle,toCycle:m.cycle,
   crossCycle:previous.cycle!==m.cycle,relations,mode:'scriptural-pattern',
   explanation:relations.includes('asevana')?'ชวนจิตก่อนหนุนชวนจิตถัดไปด้วยอาเสวนปัจจัย':'จิตก่อนดับ จิตถัดไปเกิดตามลำดับด้วยอนันตร–สมนันตร–นัตถิ–วิคตปัจจัย'});
 }
 const cycleTransitions=[];
 for(let i=1;i<cycles.length;i++){
  const prev=cycles[i-1],next=cycles[i];
  const prevMoment=moments[prev.end];
  const nextMoment=moments[next.start];
  const interval=moments.slice(prev.end+1,next.start);
  cycleTransitions.push({fromCycle:prev.id,toCycle:next.id,fromMomentId:prevMoment?.id,toMomentId:nextMoment?.id,
   bhavangaCount:interval.filter(x=>x.stage==='return').length,
   fromObjectId:prevMoment?.objectId,toObjectId:nextMoment?.objectId,
   sameObjectId:prevMoment?.objectId===nextMoment?.objectId,
   modelLink:'เรื่องราวของอารมณ์อาจสืบเนื่องสู่วิถีทางใจ แต่ไม่ใช่วัตถุทางตา/หูที่คงอยู่ตลอดและไม่ใช่อนันตรปัจจัยข้ามขณะภวังค์',
   confidence:'illustrative',
   // The intervening bhavanga moments are included in the adjacent edges, not skipped.
   edgeIds:edges.filter(e=>e.fromIndex>=prev.end&&e.toIndex<=next.start).map(e=>`${e.from}->${e.to}`)});
 }
 return {version:'0.2.0',registry:PACCAYA_24,edges,inMoments,cycleTransitions,
  counts:{adjacent:edges.length,repetition:edges.filter(e=>e.relations.includes('asevana')).length,transitions:cycleTransitions.length},
  disclaimer:'การแสดงผลครอบคลุมเฉพาะปัจจัยที่แบบจำลองระบุความสัมพันธ์ได้จากข้อมูล ไม่ได้จำลองปัฏฐาน 24 ปัจจัยอย่างครบถ้วน; การเชื่อมวิถีถัดไปเป็นกรณีศึกษา ไม่ใช่สูตรคำนวณกรรม'};
}

export function explainConditions(model,index){
 const moment=model.inMoments[index];
 if(!moment)throw new RangeError('Unknown moment index');
 return {moment,incoming:model.edges.find(e=>e.toIndex===index)??null,
  outgoing:model.edges.find(e=>e.fromIndex===index)??null,
  annotations:moment.conditions.map(id=>PACCAYA_BY_ID.get(id)),
  activeRoots:moment.roots,
  isRepetitionIncoming:!!model.edges.find(e=>e.toIndex===index&&e.relations.includes('asevana'))};
}
export function validateConditionality(process){
 const {moments,conditions,cycles}=process;
 if(!conditions||conditions.edges.length!==moments.length-1)throw Error('Temporal link count invalid');
 for(const e of conditions.edges){
  if(e.toIndex!==e.fromIndex+1||moments[e.fromIndex].id!==e.from||moments[e.toIndex].id!==e.to)throw Error('Adjacency must not skip a citta');
  for(const name of ['anantara','samanantara','natthi','vigata'])if(!e.relations.includes(name))throw Error('Mandatory temporal condition missing');
  if(e.relations.includes('asevana')&&(!['akusala','kusala','kiriya'].includes(moments[e.fromIndex].family)||
    moments[e.fromIndex].stage!=='javana'||moments[e.toIndex].stage!=='javana'||e.crossCycle||moments[e.fromIndex].cittaId>=82))throw Error('Invalid āsevana association');
 }
 for(const [i,m] of moments.entries())if(conditions.inMoments[i].momentId!==m.id||conditions.inMoments[i].factors.length!==m.active.length)throw Error('Within-moment condition invalid');
 if(conditions.cycleTransitions.length!==Math.max(0,cycles.length-1))throw Error('Missing cross-process transitions');
 return true;
}