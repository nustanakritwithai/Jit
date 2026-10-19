/** Progressive Rūpa chapter-VI explorer. Only user-declared examples are evaluated. */
import {RUPA_28,RUPA_GROUPS,RUPA_BY_ID,RUPA_ORIGINS,RUPA_SOURCES,AVINIBBHOGA_8,PHOTTHABBA_3,KALAPAS_21,SENSE_RUPA_SUPPORT,potentialOrigins,assessSenseSupport} from './rupa.js';
import {CITTA_BY_121} from './association.js';
import {assessRupaNama,FIVE_SENSE_RELATIONS} from './rupa-nama.js';

const ORIGIN_LABEL={kamma:'กรรม',citta:'จิต',utu:'อุตุ',ahara:'อาหาร'};
const STATUS_LABEL={UNKNOWN:'UNKNOWN · ยังไม่ทราบ',CONDITIONAL_ON_SCENARIO:'ตรงตามเงื่อนไขสมมติ',BLOCKED_IN_DECLARED_SCENARIO:'ขัดกับเงื่อนไขสมมติ',NOT_APPLICABLE:'ไม่ใช่ปัญจวิญญาณ'};
function elt(name,className,text){const n=document.createElement(name);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function link(ref){const a=elt('a','rupa-source-link',`${ref.tier}: ${ref.title} ↗`);a.href=ref.url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function chip(id){const r=RUPA_BY_ID.get(id);const t=elt('span','rupa-chip',`${id}. ${r.name}`);t.title=r.pali;return t;}
export function buildRupaCsv(){
 const lines=[['เลข','ชื่อไทย','ชื่อบาลี','หมวด','ชนิด','สมุฏฐานที่เป็นไปได้'].join(',')];
 const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
 for(const r of RUPA_28){const origin=potentialOrigins(r.id).map(x=>ORIGIN_LABEL[x]).join('/');
  lines.push([r.id,r.name,r.pali,RUPA_GROUPS.find(x=>x.id===r.group).name,r.kind==='concrete'?'รูปจริง 18':'รูปไม่เกิดสำเร็จ 10',origin||'ไม่เป็นสมุฏฐานแยก'].map(quote).join(','));}
 return '\uFEFF'+lines.join('\r\n');
}
export function mountRupa(root,getCurrentCittaId){
 if(!root||typeof getCurrentCittaId!=='function')throw new TypeError('Rūpa explorer needs root and current citta getter');
 root.innerHTML=`
 <div class="rupa-lead"><div><strong>รูป 28 ประเภท</strong><p>18 รูปจริง + 10 รูปไม่เกิดสำเร็จ · โผฏฐัพพะคือปฐวี เตโช วาโย ไม่ใช่รูปชนิดที่ 29</p></div><button id="rupaExport" type="button" class="rupa-action">ดาวน์โหลด CSV ↧</button></div>
 <div class="rupa-summary"><span><b>28</b> รูปทั้งหมด</span><span><b>4</b> สมุฏฐาน</span><span><b>21</b> รูปกลาป</span></div>
 <div class="rupa-columns"><section class="panel rupa-catalog" aria-label="สารบบรูป"><label class="rupa-select-label">กรองตามกลุ่ม <select id="rupaGroup"><option value="all">รูปทุกกลุ่ม (28)</option></select></label><div id="rupaCards" class="rupa-card-grid"></div></section>
 <aside class="panel rupa-inspector" aria-live="polite"><div id="rupaDetail"></div></aside></div>
 <details class="panel rupa-disclosure"><summary>เปิดดูรูปกลาป 21 กลุ่มตามสมุฏฐาน</summary><p>รูปกลาปทุกกลุ่มมีรูป 8 ชนิดที่แยกจากกันไม่ได้ อากาสธาตุเป็นเขตกำหนด ไม่ใช่องค์ประกอบที่นับเพิ่มในกลาป</p><label class="rupa-select-label">เลือกกลาป <select id="rupaKalapa"></select></label><div id="rupaKalapaDetail"></div></details>
 <section class="panel rupa-evidence"><div class="rupa-evidence-head"><div><h3>รูปสัมพันธ์กับจิตอย่างไร?</h3><p>ตรวจความจำเป็นของฐานรูปและอารมณ์สำหรับปัญจวิญญาณ 10 ประเภท โดยไม่ทำนายจิตจริง</p></div><button class="rupa-action" id="rupaSync" type="button">ใช้จิตจาก Timeline</button></div>
 <div class="rupa-form"><label>จิตตัวอย่าง <select id="rupaCitta"></select></label><label>สมมติว่ามีปสาทรูป <select id="rupaBase"><option value="unknown">ยังไม่ทราบ</option><option value="yes">มี (สมมติ)</option><option value="no">ไม่มี (สมมติ)</option></select></label><label>สมมติว่ามีอารมณ์ประเภทนี้ <select id="rupaObject"><option value="unknown">ยังไม่ทราบ</option><option value="yes">มี (สมมติ)</option><option value="no">ไม่มี (สมมติ)</option></select></label></div>
 <div class="rupa-assessment" id="rupaAssessment" aria-live="polite"></div>
 <details class="rupa-nama-disclosure" id="rupaNamaDisclosure">
 <summary>ตรวจปุเรชาตและรูป–นามตามช่วงเกิด–ดับ (ปัฏฐาน)</summary>
 <p class="rupa-caveat">ต้องระบุว่ารูปเกิดก่อนจิตและยังตั้งอยู่ ตัวเลือกทั้งหมดเป็นสมมติฐาน ไม่ใช่การตรวจวัดจริง</p>
 <div class="rupa-form">
 <label>ฐานรูปเมื่อจิตเกิด <select id="rupaBaseTiming">
 <option value="unknown">ยังไม่ทราบ</option><option value="prior-present">เกิดก่อนและยังตั้งอยู่ (สมมติ)</option>
 <option value="newly-arisen">เพิ่งเกิด (สมมติ)</option><option value="dissolving">กำลังดับ (สมมติ)</option><option value="ceased">ดับแล้ว (สมมติ)</option>
 </select></label>
 <label>รูปารมณ์เมื่อจิตเกิด <select id="rupaObjectTiming">
 <option value="unknown">ยังไม่ทราบ</option><option value="prior-present">เกิดก่อนและยังตั้งอยู่ (สมมติ)</option>
 <option value="newly-arisen">เพิ่งเกิด (สมมติ)</option><option value="dissolving">กำลังดับ (สมมติ)</option><option value="ceased">ดับแล้ว (สมมติ)</option>
 </select></label></div>
 <div id="rupaNamaStatus" aria-live="polite"></div>
 <div id="rupaNamaEvidence" class="rupa-nama-evidence"></div>
 <p class="rupa-caveat">เฉพาะปัญจวิญญาณ 10 ประเภทและปัจจยนิทเทส §§2,8,10,16,21,24; ยังไม่ตรวจวิปปยุตต/ปัจฉาชาต และไม่ยืนยันว่าจิตเกิดจริง</p>
 <a href="https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html" target="_blank" rel="noopener noreferrer">ปัฏฐาน Paccayaniddesa บาลี ↗</a>
 </details></section>
 <div class="panel rupa-sources"><h3>แหล่งคัมภีร์และขีดจำกัด</h3><div id="rupaSources"></div><p>บัญชีรูป 28 และกลาป 21 เป็นการแจกแจงตามอภิธัมมัตถสังคหะ บทที่ 6 ซึ่งเป็นคู่มืออธิบาย ไม่ใช่การอ้างว่าพระอภิธรรมปิฎกแจกเลขชุดเดียวกันไว้ทุกส่วน การแสดงรูป–นามในหน้านี้เป็นแบบจำลองเพื่อการเรียนรู้ ไม่มีข้อมูลอายุรูป ไม่มีข้อมูลกรรมบุคคล และยังไม่ได้คำนวณปัจจัยรูป–นามทั้งหมด จึงแสดง UNKNOWN เมื่อไม่ทราบ</p></div>`;
 const by=id=>root.querySelector('#'+id);
 let selected=1;
 for(const g of RUPA_GROUPS){const o=elt('option','',`${g.name} (${g.count})`);o.value=g.id;by('rupaGroup').append(o);}
 for(const k of KALAPAS_21){const o=elt('option','',`${ORIGIN_LABEL[k.origin]} · ${k.name} (${k.count})`);o.value=k.id;by('rupaKalapa').append(o);}
 for(const id of Object.keys(SENSE_RUPA_SUPPORT).map(Number).sort((a,b)=>a-b)){
  const o=elt('option','',`${id} · ${CITTA_BY_121.get(id)?.label??'ปัญจวิญญาณ'}`);o.value=id;by('rupaCitta').append(o);
 }
 for(const source of [RUPA_SOURCES.canonical,RUPA_SOURCES.manual,RUPA_SOURCES.manualBps])by('rupaSources').append(link(source));
 function detail(){
  const r=RUPA_BY_ID.get(selected),host=by('rupaDetail');host.replaceChildren();
  host.append(elt('p','rupa-eyebrow',`RŪPA ${String(r.id).padStart(2,'0')} / 28`),elt('h3','',r.name),elt('p','rupa-pali',r.pali),elt('p','',r.description));
  host.append(elt('p','rupa-kind',r.kind==='concrete'?'รูปเกิดสำเร็จ (นิปผันนรูป)':'รูปไม่เกิดสำเร็จ (อนิปผันนรูป)'));
  const origin=potentialOrigins(selected);
  host.append(elt('h4','','สมุฏฐานที่เป็นไปได้ตามบทที่ 6'),elt('p','',origin.length?origin.map(x=>ORIGIN_LABEL[x]).join(' · '):'ลักขณรูปไม่เกิดจากสมุฏฐานแยกต่างหาก'));
  if(selected===19)host.append(elt('p','rupa-caveat','อากาสธาตุใช้แบ่งกลาป ไม่ใช่สมาชิกในบัญชีองค์ประกอบของกลาป'));
  if([25,26].includes(selected))host.append(elt('p','rupa-caveat','อุปจยะและสันตติเป็นการแจกแจงสองแง่ของชาติรูป ไม่ใช่ตัวแปรก่อรูปอิสระสองชนิด'));
  if(selected===16)host.append(elt('p','rupa-caveat','หทยวัตถุเป็นการแจกแจงของคู่มือสายอรรถาธิบาย อย่าอ้างเป็นคำสั่งจากพระไตรปิฎกโดยตรง'));
  if(PHOTTHABBA_3.includes(selected))host.append(elt('p','rupa-caveat','เป็นหนึ่งใน 3 มหาภูตรูปที่เป็นโผฏฐัพพารมณ์ได้'));
  if(AVINIBBHOGA_8.includes(selected))host.append(elt('p','rupa-caveat','รูปนี้เป็นองค์ประกอบที่แยกไม่ได้ในรูปกลาปทุกชนิด'));
  host.append(link(RUPA_SOURCES.manual));
 }
 function cards(){const f=by('rupaGroup').value;const host=by('rupaCards');host.replaceChildren();
  for(const r of RUPA_28.filter(r=>f==='all'||r.group===f)){
   const b=elt('button',`rupa-card ${selected===r.id?'is-selected':''}`,`${r.id}. ${r.name}`);b.type='button';b.setAttribute('aria-pressed',String(selected===r.id));
   b.addEventListener('click',()=>{selected=r.id;cards();detail();});host.append(b);
  }
 }
 function kalapa(){const k=KALAPAS_21.find(x=>x.id===by('rupaKalapa').value);const host=by('rupaKalapaDetail');host.replaceChildren();
  host.append(elt('h4','',`${ORIGIN_LABEL[k.origin]} · ${k.name} (${k.count} รูป)`));const wrap=elt('div','rupa-chips');for(const id of k.members)wrap.append(chip(id));host.append(wrap);
  host.append(elt('p','rupa-caveat',k.externalPossible?'ตามอภิธัมมัตถสังคหะ บทที่ 6 §21: กลาปนี้พบได้ทั้งภายในและภายนอก':'ตามอภิธัมมัตถสังคหะ บทที่ 6 §21: กลาปนี้จัดเป็นกลาปฝ่ายภายใน'));
 }
 const value=v=>v==='yes'?true:v==='no'?false:null;
 function renderRupaNama(){
  const byId=id=>by(id), cittaId=Number(by('rupaCitta').value);
  for(const [existsId,timeId] of [['rupaBase','rupaBaseTiming'],['rupaObject','rupaObjectTiming']]){
   if(byId(existsId).value==='no'&&byId(timeId).value==='prior-present')byId(timeId).value='unknown';
   if(byId(existsId).value==='yes'&&byId(timeId).value==='ceased')byId(timeId).value='unknown';
  }
  const yesNo=id=>byId(id).value==='yes'?true:byId(id).value==='no'?false:null;
  const r=assessRupaNama(cittaId,{base:{present:yesNo('rupaBase'),timing:by('rupaBaseTiming').value},
   object:{present:yesNo('rupaObject'),timing:by('rupaObjectTiming').value}});
  const title=r.status==='CONDITIONAL_ON_SCENARIO'?'ตรงตามสมมติฐานที่ประกาศ (ไม่ยืนยันจิตจริง)':
   r.status==='BLOCKED_IN_DECLARED_SCENARIO'?'ขัดกับสมมติฐานช่วงเกิด–ดับ':
   r.status==='NOT_EVALUATED'?'ไม่รองรับจิตประเภทนี้':'UNKNOWN · ยังไม่มีข้อมูลพอ';
  const status=by('rupaNamaStatus');status.replaceChildren();
  status.append(elt('strong','rupa-status '+r.status.toLowerCase(),title));
  if(r.missing?.length)status.append(elt('p','rupa-caveat',r.missing.join(' · ')));
  const host=by('rupaNamaEvidence');host.replaceChildren();
  for(const rel of FIVE_SENSE_RELATIONS){
   const items=r.evidence.filter(e=>e.conditionId===rel.id);
   if(!items.length)continue;
   const row=elt('div','rupa-nama-rule');
   row.append(elt('strong','',rel.name+' · §'+rel.number));
   for(const e of items)row.append(elt('p','',(e.role==='base'?'ฐานรูป':'รูปารมณ์')+
    ' #'+e.rupaId+': '+(e.status==='CONDITIONAL_ON_SCENARIO'?'ตามสมมติฐาน':
      e.status==='BLOCKED_IN_DECLARED_SCENARIO'?'ขัดกับสมมติฐาน':'UNKNOWN')));
   const source=elt('a','rupa-source-link','Paṭṭhāna · Paccayaniddesa ↗');
   source.href=items[0].source.pali;source.target='_blank';source.rel='noopener noreferrer';
   row.append(source);host.append(row);
  }
 }
 function assess(){const cittaId=Number(by('rupaCitta').value);const info=assessSenseSupport(cittaId,{basePresent:value(by('rupaBase').value),objectPresent:value(by('rupaObject').value)});
  const host=by('rupaAssessment');host.replaceChildren();
  host.append(elt('strong',`rupa-status ${info.status.toLowerCase()}`,STATUS_LABEL[info.status]),elt('p','',info.reason));
  const needed=elt('div','rupa-chips');needed.append(chip(info.baseId));for(const id of info.objectChoices)needed.append(chip(id));host.append(elt('p','rupa-caveat','ฐานรูปและอารมณ์ที่สัมพันธ์กับจิตชนิดนี้ (กรณีสัมผัสให้เลือกหนึ่งใน 3 มหาภูตรูป)'),needed);
  host.append(elt('p','rupa-unknown','เปิดตรวจช่วงเกิด–ดับเพื่อดูปุเรชาตตามสมมติฐาน; วิปปยุตตยัง UNKNOWN'));renderRupaNama();
 }
 function refresh(){const cittaId=getCurrentCittaId();if(SENSE_RUPA_SUPPORT[cittaId]){by('rupaCitta').value=String(cittaId);assess();}}
 by('rupaGroup').addEventListener('change',()=>{const cur=RUPA_28.find(x=>x.group===by('rupaGroup').value);if(cur)selected=cur.id;cards();detail();});
 by('rupaKalapa').addEventListener('change',kalapa);
 for(const id of ['rupaCitta','rupaBase','rupaObject'])by(id).addEventListener('change',assess);
 for(const id of ['rupaBaseTiming','rupaObjectTiming'])by(id).addEventListener('change',renderRupaNama);
 by('rupaSync').addEventListener('click',refresh);
 by('rupaExport').addEventListener('click',()=>{
   const blob=new Blob([buildRupaCsv()],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=elt('a');a.href=url;a.download='jit-rupa-28.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 by('rupaCitta').value='20';cards();detail();kalapa();assess();
 return Object.freeze({refresh,selectRupa(id){if(!RUPA_BY_ID.has(id))throw new RangeError('Unknown rūpa');selected=id;by('rupaGroup').value='all';cards();detail();}});
}
