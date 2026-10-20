/** Interactive Chapter IV visayappavatti explainer.
 * The 17-slot cells are a pedagogical rūpa-duration window, not physical time
 * or an assertion that the unmodeled continuation is empirically observed.
 */
import {SENSE_GRADES,MIND_GRADES,buildSenseCourse} from './vithi-strength.js';
const element=(tag,className,text)=>{
 const x=document.createElement(tag);if(className)x.className=className;if(text!==undefined)x.textContent=text;return x;
};
export function mountStrength(root,{door,intensity,clarity,mode,onRebuild,onMoment}){
 if(!root||typeof onRebuild!=='function'||typeof onMoment!=='function')throw Error('Strength explorer needs controls');
 const q=id=>root.querySelector('#'+id);
 const delay=q('strengthDelay'),sense=q('strengthSenseGrades'),mind=q('strengthMindGrades');
 for(const [host,grades,kind] of [[sense,SENSE_GRADES,'sense'],[mind,MIND_GRADES,'mind']]){
  for(const rule of grades){
   const b=element('button','strength-grade');b.type='button';b.dataset.grade=rule.id;b.dataset.kind=kind;
   b.append(element('b','',rule.name),element('span','',rule.endpoint));
   b.addEventListener('click',()=>{if(kind==='sense')intensity.value=rule.id;else clarity.value=rule.id;onRebuild();});
   host.append(b);
  }
 }
 function syncGrade(){
  if(delay.dataset.grade===intensity.value)return;
  const rule=SENSE_GRADES.find(x=>x.id===intensity.value);
  delay.replaceChildren();
  const auto=element('option','','ตัวอย่างตั้งต้นตามระดับนี้');auto.value='auto';delay.append(auto);
  for(const value of rule.past){const o=element('option','',value+' ขณะ');o.value=String(value);delay.append(o);}
  delay.value='auto';delay.dataset.grade=intensity.value;
 }
 delay.addEventListener('change',onRebuild);
 syncGrade();
 function render(process,current){
  const isAppana=mode.value==='appana-first';
  const isMind=!isAppana&&door.value==='mind';
  const isSense=!isAppana&&!isMind;
  sense.hidden=!isSense;mind.hidden=!isMind;
  q('strengthDelayDetails').hidden=!isSense;q('strengthWindowShell').hidden=!isSense;
  root.querySelectorAll('.strength-grade').forEach(b=>{
   const selected=b.dataset.grade===(b.dataset.kind==='sense'?intensity.value:clarity.value);
   b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected));
  });
  if(isAppana){
   q('strengthOutcome').textContent='อัปปนาวิถี · ไม่ใช่หนึ่งในสี่ระดับปัญจทวาร';
   q('strengthWhy').textContent='นี่เป็นวิถีพิเศษที่มีลำดับต่างออกไป และยังมีเพียงตัวอย่างปฐมฌานครั้งแรก';
   q('strengthNumbers').textContent='กรณีศึกษา ไม่ใช่เครื่องวัดการเข้าฌาน';return;
  }
  if(isMind){
   const rule=MIND_GRADES.find(x=>x.id===clarity.value);
   q('strengthOutcome').textContent=rule.name+' · '+rule.endpoint;
   q('strengthWhy').textContent=rule.reason+' — ไม่ใช้กรอบรูป 17 ขณะสำหรับมโนทวาร';
   q('strengthNumbers').textContent='มโนทวาร · วาระตัวอย่างแยกจากกำลังอารมณ์ทั้งสี่ของปัญจทวาร';return;
  }
  const c=buildSenseCourse(process.config);
  q('strengthOutcome').textContent=c.gradeName+' · '+c.course+' · '+c.endpoint;
  q('strengthWhy').textContent=c.reason;
  q('strengthNumbers').textContent='อตีตภวังค์ '+c.pastCount+' · '+(c.hasProcess?'ภวังค์ไหว/ขาด 2 ขณะ':'ภวังค์ไหว 2 ขณะ')+' · โวฏฐัพพนะ '+(c.hasProcess?c.determiningCount:0)+
   ' · ชวนะ '+c.javanaCount+' · ตทาลัมพนะ '+c.registrationCount+
   ' · ภวังค์ภายหลังในกรอบรูป '+c.continuationCount+' ขณะ';
  q('strengthStop').textContent=c.hasProcess?'สิ้นสุดวิถีที่ '+c.endpoint+' (ช่อง '+c.activeCount+'/17) แล้วภวังค์ดำเนินต่อ':
   'โมฆวาระ: ยังไม่เกิดวิถีจิต มีเพียงภวังค์ไหว แล้วภวังค์ดำเนินต่อ';
  const window=q('strengthWindow');window.replaceChildren();
  const cycle=process.cycles.find(x=>x.kind==='five-door');
  const moment=process.moments[current];
  const activeIndex=moment.cycle===cycle?.id?current-cycle.start:-1;
  for(const [i,slot] of c.slots.entries()){
   const b=element('button','strength-slot strength-'+slot.kind);
   b.type='button';b.textContent=String(i+1);
   if(i===activeIndex)b.classList.add('is-current');
   if(i===c.activeCount-1)b.classList.add('is-ending');
   b.disabled=slot.kind==='continuation';
   b.title='ช่อง '+(i+1)+': '+slot.name;
   b.setAttribute('aria-label',b.title+(b.disabled?' (ภาพภวังค์ที่ไม่ได้เพิ่มเป็น Moment ใน Engine)':''));
   if(!b.disabled)b.addEventListener('click',()=>onMoment(cycle.start+i));
   window.append(b);
  }
 }
 return Object.freeze({syncGrade,delayValue:()=>delay.value,render});
}
