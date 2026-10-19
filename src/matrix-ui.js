import {FACTORS} from './data.js';
import {SAMPAYOGA_89,SAMPAYOGA_121,getSampayoga,resolveSampayoga} from './association.js';
import {sourceForCitta,manualLink,MANUAL_TABLES} from './sampayoga-source.js';
import {inspectOccasionalCitta,validateOccasionalExample,OCCASIONAL_SOURCE} from './cetasika-constraints.js';

const byId=id=>document.getElementById(id);
const STATUS={required:{symbol:'●',title:'ต้องเกิด'},optional:{symbol:'◇',title:'เกิดได้ตามเหตุปัจจัย'},forbidden:{symbol:'·',title:'เกิดไม่ได้'}};
const PAGE_SIZE=18;
let selectedId=31;
let optionalSelected=[];
let currentScheme=121;
let page=1;
let search='';
let realm='all';
let notification='';
function sourceRows(){return currentScheme===89?SAMPAYOGA_89:SAMPAYOGA_121;}
const el=(tag,cls='',text='')=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text)node.textContent=text;return node;};

function filteredRows(){return sourceRows().filter(c=>(realm==='all'||(realm==='akusala'?c.quality==='akusala':c.realm===realm))&&(`${c.id} ${c.label} ${c.quality} ${c.kind}`.toLocaleLowerCase('th').includes(search)));}
function factorChips(ids,status){
 const chips=el('div','matrix-factor-chips');
 for(const id of ids){
  const factor=FACTORS[id-1];
  const chip=el('span',`matrix-chip ${status}`,`${id}. ${factor.name}`);
  chip.title=`${factor.pali} — ${factor.meaning}`;
  chips.append(chip);
 }
 return chips;
}
function sourceLink(label,table){
 const anchor=el('a','matrix-source-link',label);
 anchor.href=manualLink(table);anchor.target='_blank';anchor.rel='noopener noreferrer';
 return anchor;
}
function details(){
 const row=getSampayoga(selectedId,currentScheme),host=byId('matrixDetail');
 const ref=row.aggregate?null:sourceForCitta(row.id);
 host.replaceChildren();
 const nav=el('div','citta-study-nav');
 const before=el('button','citta-study-step','← จิตก่อนหน้า');before.type='button';before.disabled=row.id<=1;
 before.addEventListener('click',()=>selectCitta(row.id-1,false));
 const position=el('span','citta-study-position',`${row.id} / ${currentScheme} ประเภท`);
 const after=el('button','citta-study-step','จิตถัดไป →');after.type='button';after.disabled=row.id>=currentScheme;
 after.addEventListener('click',()=>selectCitta(row.id+1,false));
 nav.append(before,position,after);host.append(nav);
 host.append(el('h3','',`จิตที่ ${row.id} · ${row.label}`));
 host.append(el('p','matrix-caption',`ประเภท ${row.quality==='akusala'?'อกุศล':row.quality==='kusala'?'กุศล':row.quality==='vipaka'?'วิบาก':'กิริยา'} · เวทนา ${row.feeling} · ${ref?.sourceGroup??'โลกุตตรจิตหมวดรวม'}`));
 const counts=el('div','citta-study-counts');
 for(const [key,num,label] of [['required',row.mandatory.length,'ต้องเกิด'],['optional',row.optional.length,row.aggregate?'ต่างกันตามระดับฌาน':'อาจเกิด'],['forbidden',row.prohibited.length,'เกิดไม่ได้']]){
  const tile=el('div',`citta-study-count ${key}`);tile.append(el('strong','',String(num)),el('span','',label));counts.append(tile);
 }
 host.append(counts);
 if(ref){
  const notice=el('div','citta-study-source');
  notice.append(el('strong','','ตรวจตามตารางต้นฉบับของอภิธัมมัตถสังคหะ'));
  notice.append(el('p','',`ตาราง 2.3 ระบุเลขเจตสิก: ${ref.printed} (รวม ${ref.printedTotal} ดวงที่เป็นไปได้ในหมวดนี้)`));
  const links=el('div','citta-study-references');
  links.append(sourceLink('เปิดตาราง 2.3 หน้า 101 ↗','combinations'),sourceLink('ตรวจตาราง 2.2 หน้า 92 ↗','association'));
  notice.append(links);
  notice.append(el('p','citta-study-critical','จำนวนในตาราง 2.3 คือรายการที่อาจประกอบได้ในจิตประเภทนี้ ไม่ได้หมายความว่าเจตสิกแปรผันทุกดวงเกิดพร้อมกันในขณะเดียว'));
  host.append(notice);
 }else{
  host.append(el('p','citta-study-critical','แบบ 89: จิตประเภทนี้เป็นหมวดโลกุตตรที่รวมฌาน 5 ระดับ จึงยังใช้ชุดนี้สร้างจิตหนึ่งขณะไม่ได้ ให้สลับเป็นแบบ 121 ก่อน'));
  host.append(sourceLink('ดูการแจกแจงโลกุตตรจิตในตาราง 1.1 ↗','citta'));
 }
 const basics=el('div','citta-study-basics');
 basics.append(el('strong','','เจตสิกพื้นฐานของจิตทุกดวง (7)'));
 basics.append(factorChips([1,2,3,4,5,6,7],'required'));
 host.append(basics);
 const groups=el('div','matrix-detail-groups');
 for(const [key,ids] of [['required',row.mandatory],['optional',row.optional],['forbidden',row.prohibited]]){
  const group=el('details',`matrix-factor-group ${key}`);
  const label=key==='forbidden'?'ไม่เกิดร่วมกับจิตชนิดนี้':STATUS[key].title;
  group.append(el('summary','',`${STATUS[key].symbol} ${label} (${ids.length}) · แตะเพื่อ${key==='required'?'ดูชุดเต็ม':'ดูรายชื่อ'}`));
  if(ids.length){
   const ordered=el('div','citta-study-by-category');
   for(const [tag,range] of [['สัพพจิตตสาธารณะ', [1,7]],['ปกิณณกเจตสิก',[8,13]],['อกุศลเจตสิก',[14,27]],['โสภณเจตสิก',[28,52]]]){
    const inGroup=ids.filter(f=>f>=range[0]&&f<=range[1]);
    if(inGroup.length){const pane=el('div','citta-study-factor-category');pane.append(el('h4','',`${tag} · ${inGroup.length}`),factorChips(inGroup,key));ordered.append(pane);}
   }
   group.append(ordered);
  }else group.append(el('p','matrix-caption','ไม่มีเจตสิกในสถานะนี้'));
  groups.append(group);
 }
 host.append(groups);
 const audit=inspectOccasionalCitta(row.id,{scheme:currentScheme});
 const guide=el('details','cetasika-constraint-panel');
 guide.append(el('summary','',`ตรวจเงื่อนไขเจตสิกแปรผัน 11 ดวง · ต้องเกิด ${audit.mandatory.length} / อาจเกิด ${audit.optional.length} / ไม่เกิด ${audit.forbidden.length}`));
 guide.append(el('p','matrix-caption',audit.warning));
 if(audit.aggregate)guide.append(el('p','cetasika-constraint-alert','หมวดจิต 89 นี้ยังไม่ใช่จิตเฉพาะขณะ โปรดใช้แบบ 121'));
 for(const factor of [...audit.mandatory,...audit.optional]){
  const n=el('div',`cetasika-rule-line ${factor.placement}`);
  n.append(el('strong','',`${factor.factorId}. ${factor.name} (${factor.pali}) · ${factor.placement==='required'?'ต้องเกิดเมื่อจิตประเภทนี้เกิด':'อาจเกิด · ยังไม่ยืนยันการเกิดจริง'}`));
  n.append(el('p','',factor.condition));
  if(factor.unresolvedQuestion)n.append(el('p','cetasika-unanswered',factor.unresolvedQuestion));
  if(factor.traditionDispute)n.append(el('p','cetasika-constraint-alert',factor.caveat));
  const a=el('a','matrix-source-link',`ที่มา ${factor.source.locator} ↗`);a.href=factor.source.url;a.target='_blank';a.rel='noopener noreferrer';n.append(a);
  guide.append(n);
 }
 const unavailable=el('details','cetasika-forbidden');
 unavailable.append(el('summary','',`เจตสิกแปรผันที่เกิดร่วมไม่ได้ (${audit.forbidden.length})`));
 unavailable.append(factorChips(audit.forbidden.map(x=>x.factorId),'forbidden'));guide.append(unavailable);
 const all=el('a','matrix-source-link','อ่านบทที่ 2 ของอภิธัมมัตถสังคหะ ↗');all.href=OCCASIONAL_SOURCE.narada;all.target='_blank';all.rel='noopener noreferrer';guide.append(all);
 host.append(guide);
 if(ref&&row.optional.some(n=>n===50||n===51)&&row.feeling==='อุเบกขา'&&row.realm==='kama-beautiful'){
  const note=el('p','citta-study-dispute','ข้อพิจารณาจากตำรา: สำหรับกรุณา–มุทิตาในจิตที่ประกอบอุเบกขา มีความเห็นต่างของอาจารย์บางสำนัก; ตารางนี้ใช้แบบที่ผู้เรียบเรียงอภิธัมมัตถสังคหะยอมรับ ไม่ใช่ข้อยุติทุกสำนัก (§15 บทที่ 2)');
  host.append(note);
 }
 const optionalBox=el('div','matrix-optionals');
 optionalBox.append(el('h4','','ทดลองชุดเจตสิกแปรผันที่เข้าเงื่อนไข')); 
 if(row.aggregate){
  optionalBox.append(el('p','matrix-caption','จิตแบบ 89 นี้รวม 5 ระดับฌาน จึงยังเลือกองค์ประกอบของขณะจิตไม่ได้โดยตรง กรุณาเปลี่ยนเป็นแบบ 121 ประเภทเพื่อเลือกฌานที่เฉพาะเจาะจง'));
 }else if(!row.optional.length){
  optionalBox.append(el('p','matrix-caption','จิตประเภทนี้ไม่มีเจตสิกแปรผันตามแบบจำลองสัมปโยคในคู่มือนี้'));
 }else{
  const chooser=el('details','citta-study-chooser');
  chooser.append(el('summary','','เปิดตัวเลือกทดลองเจตสิกที่อาจเกิด (ไม่ใช่การทำนายจิตจริง)'));
  const widgets=el('div','citta-study-checks');
  for(const id of row.optional){
   const f=FACTORS[id-1],line=el('label','matrix-check'),input=document.createElement('input');
   input.type='checkbox';input.checked=optionalSelected.includes(id);input.value=String(id);
   input.addEventListener('change',()=>{
    const proposed=input.checked?[...optionalSelected,id]:optionalSelected.filter(x=>x!==id);
    try{
     const result=resolveSampayoga(row.id,proposed);
     optionalSelected=[...result.chosen];notification='';
    }catch(error){notification=error.message;}
    details();
    byId('matrixDetail').querySelector('.citta-study-chooser')?.setAttribute('open','');
   });
   line.append(input,document.createTextNode(`${f.name} · ${f.pali}`));widgets.append(line);
  }
  chooser.append(widgets);
  if(notification)chooser.append(el('p','matrix-error',`เลือกชุดนี้ไม่ได้ตามกฎ: ${notification}`));
  optionalBox.append(chooser);
 }
 if(!row.aggregate){
  const resolved=resolveSampayoga(row.id,optionalSelected);
  optionalBox.append(el('p','matrix-selected',`จำนวนเจตสิกที่เลือกในตัวอย่าง: ${resolved.active.length} / 52 ดวง (${row.mandatory.length} ดวงบังคับ + ${optionalSelected.length} ดวงที่เปิดตามตัวเลือก)`));
 }
 if(!row.aggregate){
  optionalBox.append(el('p','cetasika-example-warning','ILLUSTRATIVE_ONLY · ชุดตัวอย่างที่เลือกไม่ใช่หลักฐานว่าจิตหรือเจตสิกเกิดจริง'));
  const exampleAudit=validateOccasionalExample(row.id,optionalSelected);
  if(exampleAudit.furtherReview)optionalBox.append(el('p','cetasika-constraint-alert',exampleAudit.furtherReview));
 }
 host.append(optionalBox);
 host.append(el('p','matrix-caption',`ที่มา: ${MANUAL_TABLES.citta.label}, ${MANUAL_TABLES.association.label}, ${MANUAL_TABLES.combinations.label} — ฉบับคู่มืออธิบายพระอภิธรรม ไม่ได้อ้างว่าเป็นการวัดจิตจริงหรือพยากรณ์กรรม`));
}
function updateQuickPicker(){
 const picker=byId('matrixFocus');if(!picker)return;
 picker.replaceChildren();
 for(const c of sourceRows()){
  const item=el('option','',`${String(c.id).padStart(3,'0')} · ${c.label}`);
  item.value=String(c.id);picker.append(item);
 }
 picker.value=String(selectedId);
}
function renderTable(){
 const rows=filteredRows(),count=Math.max(1,Math.ceil(rows.length/PAGE_SIZE));
 if(page>=count)page=count-1;
 const visible=rows.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE);
 const table=byId('matrixTable');table.replaceChildren();
 const thead=el('thead'),heading=el('tr');
 const mainHeader=el('th','matrix-first','เลขจิต / ประเภทจิต');mainHeader.scope='col';heading.append(mainHeader);
 for(const f of FACTORS){const th=el('th','matrix-factor-header',String(f.id).padStart(2,'0'));th.scope='col';th.title=`${f.name} (${f.pali})`;heading.append(th);}
 thead.append(heading);table.append(thead);
 const tbody=el('tbody');
 for(const c of visible){
  const tr=el('tr',c.id===selectedId?'matrix-selected-row':'');tr.dataset.cittaId=String(c.id);
  const first=el('th','matrix-first'),pick=el('button','matrix-row-trigger',`${String(c.id).padStart(3,'0')} · ${c.label}`);
  pick.type='button';pick.title=`ตรวจจิตที่ ${c.id}`;pick.setAttribute('aria-pressed',String(c.id===selectedId));pick.addEventListener('click',()=>selectCitta(c.id,false));
  first.append(pick);tr.append(first);
  const must=new Set(c.mandatory),maybe=new Set(c.optional);
  for(const f of FACTORS){const status=must.has(f.id)?'required':maybe.has(f.id)?'optional':'forbidden';
   const cell=el('td',`matrix-cell ${status}`,STATUS[status].symbol);
   cell.title=`${f.name}: ${STATUS[status].title} (จิต ${c.id})`;
   cell.setAttribute('aria-label',`${f.name}: ${STATUS[status].title}`);
   tr.append(cell);
  }
  tbody.append(tr);
 }
 if(!visible.length){const tr=el('tr');const cell=el('td','matrix-no-results','ไม่พบจิตตามตัวกรอง');cell.colSpan=53;tr.append(cell);tbody.append(tr);}
 table.append(tbody);
 byId('matrixPage').textContent=`หน้า ${page+1}/${count} · แสดง ${visible.length} จาก ${rows.length} ประเภท`;
 byId('matrixPrev').disabled=page===0;byId('matrixNext').disabled=page>=count-1;
 byId('matrixSize').textContent=`${sourceRows().length} × 52 ช่อง`;
}
function selectCitta(id,scroll=true){
 if(currentScheme===89&&id>89)currentScheme=121;
 selectedId=id;optionalSelected=[];notification='';
 byId('matrixScheme').value=String(currentScheme);
 updateQuickPicker();
 const rows=filteredRows();if(!rows.some(c=>c.id===id)){realm='all';search='';byId('matrixRealm').value='all';byId('matrixSearch').value='';}
 page=Math.max(0,Math.floor(filteredRows().findIndex(c=>c.id===id)/PAGE_SIZE));
 renderTable();details();
 if(scroll)byId('sampayoga').scrollIntoView({behavior:'smooth',block:'start'});
}
export function buildMatrixCsv(scheme=121){
 if(![89,121].includes(scheme))throw new RangeError('Unknown citta scheme');
 const rows=scheme===89?SAMPAYOGA_89:SAMPAYOGA_121;
 const safe=s=>'"'+String(s).replaceAll('"','""')+'"';
 const header=['Citta ID','ชื่อจิต','Ethics','Realm',...FACTORS.map(f=>`${f.id}-${f.name}`)];
 const lines=[header.map(safe).join(',')];
 for(const row of rows){
  const must=new Set(row.mandatory),optional=new Set(row.optional);
  const cells=[row.id,row.label,row.quality,row.realm,...FACTORS.map(f=>must.has(f.id)?'ต้องเกิด':optional.has(f.id)?'อาจเกิด':'ไม่ได้')];
  lines.push(cells.map(safe).join(','));
 }
 return '\uFEFF'+lines.join('\r\n');
}
function csvExport(){
 const blob=new Blob([buildMatrixCsv(currentScheme)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=`jit-sampayoga-${currentScheme}x52.csv`;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}

export function mountMatrix(){
 for(const r of ['all','akusala','rootless','kama-beautiful','rupa','arupa','lokuttara']){
  const names={all:'จิตทุกหมวด',akusala:'อกุศล 12',rootless:'อเหตุกจิต 18','kama-beautiful':'กามาวจรโสภณ 24',rupa:'รูปาวจร 15',arupa:'อรูปาวจร 12',lokuttara:'โลกุตตร 8/40'};
  const node=el('option','',names[r]);node.value=r;byId('matrixRealm').append(node);
 }
 byId('matrixScheme').addEventListener('change',e=>{
  currentScheme=Number(e.target.value);selectedId=31;optionalSelected=[];page=1;notification='';updateQuickPicker();renderTable();details();
 });
 byId('matrixSearch').addEventListener('input',e=>{search=e.target.value.trim().toLocaleLowerCase('th');page=0;renderTable();});
 byId('matrixRealm').addEventListener('change',e=>{realm=e.target.value;page=0;renderTable();});
 byId('matrixPrev').addEventListener('click',()=>{page--;renderTable();});
 byId('matrixNext').addEventListener('click',()=>{page++;renderTable();});
 byId('matrixCSV').addEventListener('click',csvExport);
 byId('matrixFocus').addEventListener('change',e=>selectCitta(Number(e.target.value),false));
 updateQuickPicker();renderTable();details();
 return {selectCitta,refresh:()=>{renderTable();details();}};
}