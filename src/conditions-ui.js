import {PACCAYA_24,PACCAYA_BY_ID,explainConditions} from './conditions.js';
import {FACTORS} from './data.js';

const $=id=>document.getElementById(id);
const el=(tag,cls='',value='')=>{const node=document.createElement(tag);if(cls)node.className=cls;if(value)node.textContent=value;return node;};

export function mountConditions(getProcess,getCurrent,setCurrent){
 const catalog=$('paccayaCatalog');
 for(const p of PACCAYA_24){const item=el('div','paccaya-item '+p.mode),head=el('div','paccaya-title');
  head.append(el('b','',`${String(p.number).padStart(2,'0')} · ${p.name}`),el('span','',p.mode==='illustrated'?'แสดงตามขอบเขตโมเดล':'แสดงชื่ออ้างอิงเท่านั้น'));
  item.append(head,el('p','',p.description));catalog.append(item);
 }
 function render(){
  const process=getProcess(),current=getCurrent(),m=process.moments[current],info=explainConditions(process.conditions,current);
  $('conditionCount').textContent=process.conditions.counts.adjacent;
  $('repetitionCount').textContent=process.conditions.counts.repetition;
  $('betweenCount').textContent=process.conditions.counts.transitions;
  const auditBox=$('causalInspector');auditBox.replaceChildren();
  const selection=m.ruleAudit?.selection,transition=m.ruleAudit?.transition;
  const assumption=selection?.basis==='scenario-assumption';
  const status=el('div','causal-audit-row');
  status.append(el('span','causal-audit-badge '+(assumption?'assumed':'documented'),assumption?'สมมติฐานของระบบ':'กรอบตามคัมภีร์/คู่มือ'),
    el('strong','',selection?.rule??'ไม่มีกฎเลือก'),
    el('p','',selection?.reason??'ยังไม่มีคำอธิบายกฎเลือก'));
  auditBox.append(status);
  const predecessor=el('div','causal-audit-row');
  predecessor.append(el('span','causal-audit-badge '+(transition?.basis==='scenario-assumption'?'assumed':'documented'),
    transition?.basis==='scenario-assumption'?'ลำดับตั้งต้นตามฉาก':'ลำดับจิตตามกรอบตำรา'),
    el('strong','',transition?.rule??'ไม่ระบุ'),el('p','',transition?.reason??'ยังไม่ระบุเหตุ'));
  auditBox.append(predecessor);
  const source=selection?.source;
  if(source?.url){const link=el('a','causal-source-link','ดูแหล่งอ้างอิง: '+source.title+' ↗');link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';auditBox.append(link);}
  if(assumption){auditBox.append(el('p','condition-note',
    'กฎเลือกชวนจิตหรือผลวิบากที่กำหนดเป็นเพียงสถานการณ์ศึกษา ไม่ได้พยากรณ์ว่าขณะถัดไปของบุคคลจริงต้องเกิดแบบนี้'));}
  const within=$('conditionWithin');within.replaceChildren();
  const title=el('h3','',`${m.name} · จิตลำดับ ${m.cittaId}/121`),tip=el('p','condition-muted','ปัจจัยที่อธิบายได้จากชุดจิต–เจตสิกในขณะปัจจุบัน');
  within.append(title,tip);
  const roots=info.activeRoots.length?info.activeRoots.map(id=>FACTORS[id-1].name).join(' · '):'ไม่ปรากฏเหตุเจตสิก (อเหตุกจิต)';
  within.append(el('div','condition-fact',`เหตุเจตสิก: ${roots}`));
  within.append(el('div','condition-fact',`อารมณ์: ${m.object} · Object ID: ${m.objectId}`));
  const withinTerms=el('div','condition-tags');
  for(const id of info.moment.conditions){const t=PACCAYA_BY_ID.get(id),chip=el('span','condition-tag',t?.name||id);chip.title=t?.description||id;withinTerms.append(chip);}
  within.append(withinTerms);
  if(m.family==='vipaka')within.append(el('p','condition-muted','วิบากจิตเป็นผลของกรรมก่อนหน้า แต่เครื่องจำลองไม่อาจระบุว่ากรรมใดเป็นเหตุเฉพาะ หรือคำนวณผลกรรมจากชวนจิตก่อนหน้าได้'));
  const incoming=$('conditionIncoming');incoming.replaceChildren();
  for(const [heading,edge] of [['ปัจจัยจากขณะก่อน',info.incoming],['ปัจจัยไปขณะถัดไป',info.outgoing]]){
   const block=el('div','condition-edge-block');block.append(el('h4','',heading));
   if(!edge){block.append(el('p','condition-muted','ไม่มีขณะนี้ในลำดับที่จำลอง'));}
   else{
    const source=process.moments[edge.fromIndex],target=process.moments[edge.toIndex];
    block.append(el('p','condition-muted',`ขณะ ${source.order} ${source.name} → ${target.order} ${target.name}`));
    const row=el('div','condition-tags');
    for(const id of edge.relations){const p=PACCAYA_BY_ID.get(id);const chip=el('span','condition-tag'+(id==='asevana'?' repetition':''),p.name);chip.title=p.description;row.append(chip);}
    block.append(row);
    if(edge.relations.includes('asevana'))block.append(el('p','condition-note','อาเสวนปัจจัยใช้เฉพาะชวนจิตที่ต่อกันในวิถีเดียวกันตามกรณีศึกษานี้'));
   }
   incoming.append(block);
  }
  const bridge=$('conditionBridges');bridge.replaceChildren();
  if(!process.conditions.cycleTransitions.length){bridge.append(el('p','condition-muted','เปิดตัวเลือก “ต่อมโนทวารวิถี” เพื่อดูขณะภวังค์และความสืบต่อระหว่างสองวิถี'));}
  else for(const link of process.conditions.cycleTransitions){
   const route=el('div','bridge-route');
   route.append(el('div','route-phase',`วิถี ${link.fromCycle}`),el('span','route-arrow','→'),el('div','route-phase muted',`ภวังค์คั่น ${link.bhavangaCount} ขณะ`),el('span','route-arrow','→'),el('div','route-phase',`วิถี ${link.toCycle}`));
   bridge.append(route,el('p','condition-muted',link.modelLink));
   bridge.append(el('p','condition-note','จำนวนภวังค์คั่นที่ผู้ใช้เลือกเป็นค่าของแอนิเมชันเพื่อการศึกษา ไม่ใช่จำนวนคงที่ตามพระอภิธรรม การเชื่อมเนื้อหาอารมณ์ข้ามวิถีเป็นคำอธิบายประกอบ มิใช่หลักฐานว่ามีอารมณ์รูปเดิมที่ไม่ดับ'));
  }
  const links=$('conditionEdges');links.replaceChildren();
  const first=Math.max(0,current-3),last=Math.min(process.conditions.edges.length-1,current+2);
  for(let i=first;i<=last;i++){
   const edge=process.conditions.edges[i],from=process.moments[edge.fromIndex],to=process.moments[edge.toIndex],
    row=el('button','condition-row'+(i===current-1||i===current?' selected':'')+(edge.relations.includes('asevana')?' has-repetition':''));
   row.type='button';row.append(el('span','condition-row-num',`${String(from.order).padStart(2,'0')} → ${String(to.order).padStart(2,'0')}`),el('span','condition-row-name',`${from.name} → ${to.name}`),el('span','condition-row-kind',edge.relations.includes('asevana')?'อาเสวน + 4 ปัจจัย':'4 ปัจจัยต่อเนื่อง'));
   row.title='เลือกขณะปลายทางของความสัมพันธ์';row.addEventListener('click',()=>setCurrent(edge.toIndex));links.append(row);
  }
 }
 render();
 return {render};
}
