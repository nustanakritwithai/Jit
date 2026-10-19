/**
 * JIT v0.5: aniyata-yogi cetasika constraints.
 * Sources: Abhidhammatthasangaha chapter II §§6, 8, 10–15;
 * Narada, A Manual of Abhidhamma, Chapter II, notes 52–54.
 * These type rules NEVER determine what actually arose in a person.
 */
import {FACTORS} from './data.js';
import {getSampayoga,resolveSampayoga} from './association.js';

export const OCCASIONAL_IDS=Object.freeze([20,22,23,24,25,26,47,48,49,50,51]);
export const OCCASIONAL_SOURCE=Object.freeze({
 title:'อภิธัมมัตถสังคหะ บทที่ 2 · สัมปโยคของเจตสิก',
 tier:'คัมภีร์คู่มือและคำอธิบาย ไม่ใช่พระอภิธรรมปิฎกโดยตรง',
 narada:'https://budsas.panha.vn/ebud/abhisgho/abhis02.html',
 manual:'https://www.abhidhamma.org/wp-content/uploads/2025/05/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf#page=97'
});
const r=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const appaman=(r(31,38).concat(r(47,54),r(55,58),r(60,63),r(65,68)));
const templates=[
 [20,'§6(d), §10',[3,4,7,8],[],'ความถือตัว; เฉพาะโลภมูลจิตที่ไม่ประกอบทิฏฐิ','mana'],
 [22,'§6(e), §10',[9,10],[],'ความริษยา เกิดได้ในโทสมูลจิต ไม่เกิดพร้อมมัจฉริยะหรือกุกกุจจะ','dosa-options'],
 [23,'§6(e), §10',[9,10],[],'ความตระหนี่หวงแหน เกิดได้ในโทสมูลจิต ไม่เกิดพร้อมอิสสาหรือกุกกุจจะ','dosa-options'],
 [24,'§6(e), §10',[9,10],[],'ความเดือดร้อนใจต่ออกุศลที่ทำหรือกุศลที่ไม่ได้ทำ ไม่เกิดพร้อมอิสสาหรือมัจฉริยะ','dosa-options'],
 [25,'§6(f), §10',[2,4,6,8,10],[],'ถีนะเกิดเป็นครั้งคราวเฉพาะอกุศลสสังขาริก 5 ประเภท เมื่อเกิดต้องเกิดร่วมกับมิทธะ','thina-middha'],
 [26,'§6(f), §10',[2,4,6,8,10],[],'มิทธะเกิดเป็นครั้งคราวเฉพาะอกุศลสสังขาริก 5 ประเภท เมื่อเกิดต้องเกิดร่วมกับถีนะ','thina-middha'],
 [47,'§8(b), §10, §14',r(31,38),r(82,121),'เว้นวจีทุจริตเมื่อมีเหตุให้เว้น; โลกียวิรตีเกิดแยก โลกุตตรเกิดครบสาม','virati'],
 [48,'§8(b), §10, §14',r(31,38),r(82,121),'เว้นกายทุจริตเมื่อมีเหตุให้เว้น; โลกียวิรตีเกิดแยก โลกุตตรเกิดครบสาม','virati'],
 [49,'§8(b), §10, §14',r(31,38),r(82,121),'เว้นมิจฉาชีพเมื่อมีเหตุให้เว้น; โลกียวิรตีเกิดแยก โลกุตตรเกิดครบสาม','virati'],
 [50,'§8(c), §10, §12, §14',appaman,[],'กรุณามีสัตว์ผู้ทุกข์เป็นอารมณ์; ไม่เกิดพร้อมมุทิตา','appamanna'],
 [51,'§8(c), §10, §12, §14',appaman,[],'มุทิตามีสัตว์ผู้ได้ดีเป็นอารมณ์; ไม่เกิดพร้อมกรุณา','appamanna']
];
export const OCCASIONAL_RULES=Object.freeze(templates.map(([id,ref,optionalOn,requiredOn,condition,group])=>Object.freeze({
 id,group,condition,optionalOn:Object.freeze(optionalOn),requiredOn:Object.freeze(requiredOn),
 source:Object.freeze({url:OCCASIONAL_SOURCE.narada,locator:'บทที่ 2 '+ref,tier:OCCASIONAL_SOURCE.tier})
})));
const byFactor=new Map(OCCASIONAL_RULES.map(x=>[x.id,x]));
export function getOccasionalRule(factorId){
 const rule=byFactor.get(factorId);
 if(!rule)throw new RangeError('Not an aniyata-yogi cetasika: '+factorId);
 return rule;
}
export function documentedPlacement(cittaId,factorId){
 const rule=getOccasionalRule(factorId);
 if(!Number.isInteger(cittaId)||cittaId<1||cittaId>121)throw new RangeError('Expected a concrete citta in 1–121');
 return rule.requiredOn.includes(cittaId)?'required':rule.optionalOn.includes(cittaId)?'optional':'forbidden';
}
export function inspectOccasionalFactor(cittaId,factorId,{scheme=121}={}){
 const rule=getOccasionalRule(factorId),row=getSampayoga(cittaId,scheme);
 const placement=row.mandatory.includes(factorId)?'required':row.optional.includes(factorId)?'optional':'forbidden';
 if(scheme===121&&placement!==documentedPlacement(cittaId,factorId))
  throw Error('Doctrinal mask mismatch: citta '+cittaId+', factor '+factorId);
 const traditionDispute=(factorId===50||factorId===51)&&row.feeling==='อุเบกขา'&&row.realm==='kama-beautiful'&&placement==='optional';
 return Object.freeze({
  cittaId,factorId,name:FACTORS[factorId-1].name,pali:FACTORS[factorId-1].pali,
  placement,group:rule.group,condition:rule.condition,source:rule.source,
  occurrence:row.aggregate?'UNKNOWN_AGGREGATE':placement==='required'?'REQUIRED_IF_CITTA_ARISES':placement==='forbidden'?'EXCLUDED_BY_CITTA_TYPE':'UNKNOWN',
  permittedAsExample:!row.aggregate&&placement!=='forbidden',
  traditionDispute,unresolvedQuestion:placement==='optional'?'จิตประเภทนี้ประกอบได้ แต่ยังไม่มีข้อมูลว่ามีเจตสิกนี้เกิดจริงในขณะนั้น':null,
  caveat:traditionDispute?'ความเห็นต่าง: อาจารย์บางสำนักไม่ถือว่ากรุณา/มุทิตาเกิดกับจิตกามาวจรอุเบกขาได้':'เป็นกฎความเข้ากันได้ของประเภทจิต ไม่ใช่การวัดจิตจริง'
 });
}
export function inspectOccasionalCitta(cittaId,{scheme=121}={}){
 const row=getSampayoga(cittaId,scheme);
 const factors=Object.freeze(OCCASIONAL_IDS.map(id=>inspectOccasionalFactor(cittaId,id,{scheme})));
 return Object.freeze({
  cittaId,scheme,label:row.label,aggregate:!!row.aggregate,factors,
  mandatory:factors.filter(x=>x.placement==='required'),
  optional:factors.filter(x=>x.placement==='optional'),
  forbidden:factors.filter(x=>x.placement==='forbidden'),
  warning:row.aggregate?'หมวด 89 รวมระดับฌาน 5 แบบ ไม่ใช่จิตหนึ่งขณะ กรุณาเลือก 121':
   'อาจเกิด ไม่เท่ากับเกิดจริง; เมื่อไม่ทราบเงื่อนไขเพียงพอให้ผล UNKNOWN'
 });
}
export function validateOccasionalExample(cittaId,optionalIds=[]){
 const bad=optionalIds.filter(id=>!OCCASIONAL_IDS.includes(id));
 if(bad.length)throw new RangeError('Requested non-occasional factors: '+bad.join(','));
 const a=resolveSampayoga(cittaId,optionalIds);
 const both=optionalIds.some(id=>[47,48,49].includes(id))&&optionalIds.some(id=>[50,51].includes(id));
 return Object.freeze({
  cittaId,active:Object.freeze([...a.active]),optionalIds:Object.freeze([...a.chosen]),
  epistemicStatus:'ILLUSTRATIVE_ONLY',exactObservedCittaId:null,exactObservedFactors:null,
  furtherReview:both?'UNVERIFIED_JOINT_CONTEXT: การเกิดร่วมข้ามหมวดวิรตีกับอัปปมัญญายังไม่ได้รับการยืนยันจากเงื่อนไขกรณีนี้':null
 });
}
export function verifyOccasionalMatrix(){
 for(let c=1;c<=121;c++)for(const id of OCCASIONAL_IDS)inspectOccasionalFactor(c,id);
 return true;
}
