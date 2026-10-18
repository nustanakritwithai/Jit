import {FACTORS} from './data.js';
import {SAMPAYOGA_89,SAMPAYOGA_121,getSampayoga,resolveSampayoga} from './association.js';

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
function details(){
 const row=getSampayoga(selectedId,currentScheme),host=byId('matrixDetail');host.replaceChildren();
 const title=el('h3','',`จิตที่ ${row.id} · ${row.label}`);host.append(title);
 const meta=el('p','matrix-caption',`ต้องเกิด ${row.mandatory.length} · เกิดได้ ${row.optional.length} · เกิดไม่ได้ ${row.prohibited.length} เจตสิก`);host.append(meta);
 const factors=el('div','matrix-detail-groups');
 for(const [key,ids] of [['required',row.mandatory],['optional',row.optional]]){
  const group=el('details','matrix-factor-group');group.append(el('summary','',`${STATUS[key].symbol} ${STATUS[key].title} (${ids.length}) · แตะเพื่อดูรายชื่อ`));
  const chips=el('div','matrix-factor-chips');
  for(const id of ids){const factor=FACTORS[id-1],name=el('span',`matrix-chip ${key}`,`${id}. ${factor.name}`);name.title=factor.pali;chips.append(name);}
  group.append(chips);factors.append(group);
 }
 host.append(factors);
 const optionalBox=el('div','matrix-optionals');
 optionalBox.append(el('h4','','ทดสอบเจตสิกที่เกิดได้ (หนึ่งขณะจิต)'));
 if(row.aggregate){
  optionalBox.append(el('p','matrix-caption','แบบ 89 ประเภท รวมโลกุตตรจิต 5 ระดับฌาน จึงเลือกองค์ประกอบของขณะจิตไม่ได้โดยตรง กรุณาเปลี่ยนเป็นแบบ 121 ประเภทเพื่อกำหนดฌานที่เฉพาะเจาะจง'));
 }else{
  for(const id of row.optional){
   const f=FACTORS[id-1],line=el('label','matrix-check'),input=document.createElement('input');
   input.type='checkbox';input.checked=optionalSelected.includes(id);input.value=String(id);input.addEventListener('change',()=>{
    const proposed=input.checked?[...optionalSelected,id]:optionalSelected.filter(x=>x!==id);
    try{
     const result=resolveSampayoga(row.id,proposed);
     optionalSelected=[...result.chosen];notification='';
    }catch(error){notification=error.message;}
    details();
   });
   line.append(input,document.createTextNode(`${f.name} · ${f.pali}`));optionalBox.append(line);
  }
  const resolve=resolveSampayoga(row.id,optionalSelected);
  optionalBox.append(el('p','matrix-selected',`ตัวอย่างขณะนี้: เจตสิกเกิดร่วม ${resolve.active.length} / 52 ดวง`));
  if(notification)optionalBox.append(el('p','matrix-error',`ไม่สามารถเลือกชุดนี้: ${notification}`));
 }
 host.append(optionalBox);
 host.append(el('p','matrix-caption','ตารางบอกความเป็นไปได้ของการประกอบ ไม่ใช่ความน่าจะเป็นเชิงสถิติ หรือการวัดจิตจริงของผู้ชม'));
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