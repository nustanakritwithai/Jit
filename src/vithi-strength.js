/** Abhidhammatthasaṅgaha Chapter IV §§5–12: 15 five-door worked object-presentation variants.
 * This is a COMMENTARIAL worked model, not a physical stopwatch or mind detector.
 */
const grades=[
 ['very-great','อติมหันตารมณ์','Atimahantārammaṇa',[1],1,'ตทาลัมพนวาระ','ถึงตทาลัมพนะ 2 ขณะ','กรณีที่อารมณ์ยังอยู่จนถึงตทาลัมพนะ ครบ 17 ขณะ'],
 ['great','มหันตารมณ์','Mahantārammaṇa',[2,3],2,'ชวนวาระ','ถึงชวนะ 7 ขณะ','อารมณ์ไม่อยู่ถึงตทาลัมพนะสองขณะ จึงกลับเข้าสู่ภวังค์หลังชวนะ'],
 ['slight','ปริตตารมณ์','Parittārammaṇa',[4,5,6,7,8,9],6,'โวฏฐัพพนวาระ','ถึงโวฏฐัพพนะ 2–3 ขณะ','อารมณ์ไม่อยู่จนถึงชวนะ จึงกลับเข้าสู่ภวังค์หลังโวฏฐัพพนะ'],
 ['very-slight','อติปริตตารมณ์','Atiparittārammaṇa',[10,11,12,13,14,15],15,'โมฆวาระ','มีเพียงภวังค์ไหว','อารมณ์ใกล้ดับจนไม่เกิดวิถีจิต มีเพียงภวังค์ไหวสองขณะ']
];
export const SENSE_GRADES=Object.freeze(grades.map(([id,name,pali,past,defaultPast,course,endpoint,reason])=>
 Object.freeze({id,name,pali,past:Object.freeze(past),defaultPast,course,endpoint,reason})));
export const MIND_GRADES=Object.freeze([
 Object.freeze({id:'clear',name:'วิภูตารมณ์',endpoint:'ชวนะ 7 + ตทาลัมพนะ 2',reason:'ในกรณีธรรมารมณ์ชัด มีตทาลัมพนะหลังชวนะ'}),
 Object.freeze({id:'obscure',name:'อวิภูตารมณ์',endpoint:'ชวนะ 7 ไม่มีตทาลัมพนะ',reason:'ในกรณีธรรมารมณ์ไม่ชัด กลับสู่ภวังค์หลังชวนะ'})
]);
export const VITHI_SOURCE=Object.freeze({title:'Abhidhammatthasaṅgaha Chapter IV §§5–12',tier:'คู่มือและคำอธิบายหลังพระไตรปิฎก',url:'https://www.ruyimeditation.org/theravada/abhidhamma/vithi-sangaha/',expanded:'https://www.bps.lk/olib/bp/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf'});
export const SLOT_NAMES=Object.freeze({past:'อตีตภวังค์',vibrate:'ภวังคจลนะ',arrest:'ภวังคุปัจเฉทะ',five_advert:'ปัญจทวาราวัชชนะ',sense:'ปัญจวิญญาณ',receive:'สัมปฏิจฉนะ',investigate:'สันตีรณะ',determine:'โวฏฐัพพนะ',javana:'ชวนะ',register:'ตทาลัมพนะ',continuation:'ภวังค์หลังสิ้นสุดวิถี'});
/** Fifteen subtypes: 1+2+6+6; past delay is a declared teaching parameter.
 * In the slight worked route, 3 determining moments except past=9, where
 * the selected 17-slot diagram has room for only two.
 */
export function buildSenseCourse(config={}){
 const rule=SENSE_GRADES.find(g=>g.id===(config.intensity??'very-great'));
 if(!rule)throw new RangeError('Unknown five-door object grade');
 const delay=config.objectDelay??'auto';
 const past=delay==='auto'?rule.defaultPast:Number(delay);
 if(!Number.isInteger(past)||!rule.past.includes(past))throw new RangeError('Object delay incompatible with selected grade');
 const determining=rule.id==='slight'?(past===9?2:3):1;
 const stages=Array(past).fill('past');
 if(rule.id==='very-slight')stages.push('vibrate','vibrate');
 else{
  stages.push('vibrate','arrest','five_advert','sense','receive','investigate');
  stages.push(...Array(determining).fill('determine'));
  if(rule.id==='very-great'||rule.id==='great')stages.push(...Array(7).fill('javana'));
  if(rule.id==='very-great')stages.push('register','register');
 }
 const continuation=17-stages.length;
 if(continuation<0)throw Error('Sense course exceeds 17-moment illustrative rūpa lifespan');
 const slots=stages.map((stage,index)=>Object.freeze({index:index+1,stage,
  kind:['past','vibrate','arrest'].includes(stage)?'bhavanga':'process',name:SLOT_NAMES[stage]}));
 for(let i=0;i<continuation;i++)slots.push(Object.freeze({index:slots.length+1,stage:'continuation',kind:'continuation',name:SLOT_NAMES.continuation}));
 return Object.freeze({grade:rule.id,gradeName:rule.name,pali:rule.pali,course:rule.course,endpoint:rule.endpoint,reason:rule.reason,
  pastCount:past,determiningCount:determining,activeCount:stages.length,continuationCount:continuation,objectSpan:17,
  hasProcess:rule.id!=='very-slight',javanaCount:['very-great','great'].includes(rule.id)?7:0,
  registrationCount:rule.id==='very-great'?2:0,stages:Object.freeze(stages),slots:Object.freeze(slots),
  source:VITHI_SOURCE,scope:'selected-instructional-five-door-object-window'});
}
