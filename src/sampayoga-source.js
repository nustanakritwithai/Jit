/**
 * Independently transcribed grouping of the canonical factor-number lists in
 * A Comprehensive Manual of Abhidhamma, Table 2.3 (printed p.101).
 * Groups reference fixed cetasika NUMBER SETS; they are not a statement that
 * every eligible occasional mental factor arises together.
 * The optional subclassification follows Table 2.2 (printed p.92) and
 * Chapter II, §§13–17 (printed pp.95–100), not a statistical assumption.
 *
 * This reference data is deliberately independent of association.js, so tests
 * can compare 121 × 52 cells rather than re-test the implementation's rules.
 */
export const BPS_MANUAL_URL = 'https://www.abhidhamma.org/wp-content/uploads/2025/05/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf';
export const MANUAL_TABLES = Object.freeze({
  citta: {label:'ตาราง 1.1 · จิต 89/121 ประเภท',page:28,pdfPage:53},
  association:{label:'ตาราง 2.2 · เจตสิกเกิดร่วมกับจิตประเภทใด',page:92,pdfPage:97},
  combinations:{label:'ตาราง 2.3 · ชุดเจตสิกของจิตแต่ละประเภท',page:101,pdfPage:106},
  adjuncts:{label:'บทที่ 2 §§13–17 · เจตสิกที่เกิดได้เป็นครั้งคราว',page:99,pdfPage:104},
});
const r=(a,b)=>Array.from({length:b-a+1},(_,i)=>i+a);
const exprIds=expr=>[...new Set(expr.split(',').flatMap(part=>{
 const text=part.trim();
 if(!/^\d+(?:\s*[-–]\s*\d+)?$/.test(text))throw Error(`Bad printed factor range ${text}`);
 const nums=text.split(/\s*[-–]\s*/).map(Number);
 return nums.length===2?r(nums[0],nums[1]):nums;
 }))].sort((a,b)=>a-b);
const records=[];
function register(ids,printed,expectedTotal,optional=[],family=''){
 const possible=exprIds(printed);
 if(possible.length!==expectedTotal)throw Error(`Reference transcription count mismatch: ${ids} expected ${expectedTotal}, got ${possible.length}`);
 if(optional.some(i=>!possible.includes(i)))throw Error(`Optional factor missing in print: ${ids}`);
 for(const id of ids){
  if(records.some(x=>x.id===id))throw Error(`Duplicate reference citta ${id}`);
  records.push(Object.freeze({id,sourceGroup:family,printed,printedTotal:expectedTotal,
   eligible:Object.freeze(possible),optional:Object.freeze([...optional].sort((a,b)=>a-b)),
   required:Object.freeze(possible.filter(f=>!optional.includes(f))),
   excluded:Object.freeze(r(1,52).filter(f=>!possible.includes(f)))}));
 }
}
// Unwholesome: Table 2.3, 1–12.
register([1],'1-19',19,[],'โลภมูลจิต');
register([2],'1-19, 25, 26',21,[25,26],'โลภมูลจิต');
register([3],'1-18, 20',19,[20],'โลภมูลจิต');
register([4],'1-18, 20, 25, 26',21,[20,25,26],'โลภมูลจิต');
register([5],'1-11, 13, 14-19',18,[],'โลภมูลจิต');
register([6],'1-11, 13, 14-19, 25, 26',20,[25,26],'โลภมูลจิต');
register([7],'1-11, 13, 14-18, 20',18,[20],'โลภมูลจิต');
register([8],'1-11, 13, 14-18, 20, 25, 26',20,[20,25,26],'โลภมูลจิต');
register([9],'1-11, 13, 14-17, 21-24',20,[22,23,24],'โทสมูลจิต');
register([10],'1-11, 13, 14-17, 21-24, 25, 26',22,[22,23,24,25,26],'โทสมูลจิต');
register([11],'1-9, 11, 14-17, 27',15,[],'โมหมูลจิต');
register([12],'1-11, 14-17',15,[],'โมหมูลจิต');
// Rootless: each of the entries of Table 2.3, 13–30.
register([...r(13,17),...r(20,24)],'1-7',7,[],'ปัญจวิญญาณสิบดวง');
register([18,25],'1-10',10,[],'สัมปฏิจฉนะ');
register([19,27],'1-10',10,[],'สันตีรณะอุเบกขา');
register([26],'1-10, 12',11,[],'สันตีรณะโสมนัส');
register([28],'1-10',10,[],'ปัญจทวาราวัชชนะ');
register([29],'1-11',11,[],'มโนทวาราวัชชนะ');
register([30],'1-12',12,[],'หสิตุปปาทะ');
// Sense-sphere beautiful, Table 2.3, 31–54: conditional factors do not
// all co-occur. Virati 47–49 singly in mundane kusala; karuna/mudita 50/51
// singly when present. The alternative tradition on equanimity is annotated
// in the UI, not silently applied as a new forbidden rule.
register([31,32],'1-13, 28-52',38,[47,48,49,50,51],'มหากุศลโสมนัสประกอบญาณ');
register([33,34],'1-13, 28-51',37,[47,48,49,50,51],'มหากุศลโสมนัสไม่ประกอบญาณ');
register([35,36],'1-11, 13, 28-52',37,[47,48,49,50,51],'มหากุศลอุเบกขาประกอบญาณ');
register([37,38],'1-11, 13, 28-51',36,[47,48,49,50,51],'มหากุศลอุเบกขาไม่ประกอบญาณ');
register([39,40],'1-13, 28-46, 52',33,[],'มหาวิบากโสมนัสประกอบญาณ');
register([41,42],'1-13, 28-46',32,[],'มหาวิบากโสมนัสไม่ประกอบญาณ');
register([43,44],'1-11, 13, 28-46, 52',32,[],'มหาวิบากอุเบกขาประกอบญาณ');
register([45,46],'1-11, 13, 28-46',31,[],'มหาวิบากอุเบกขาไม่ประกอบญาณ');
register([47,48],'1-13, 28-46, 50-52',35,[50,51],'มหากิริยาโสมนัสประกอบญาณ');
register([49,50],'1-13, 28-46, 50, 51',34,[50,51],'มหากิริยาโสมนัสไม่ประกอบญาณ');
register([51,52],'1-11, 13, 28-46, 50-52',34,[50,51],'มหากิริยาอุเบกขาประกอบญาณ');
register([53,54],'1-11, 13, 28-46, 50, 51',33,[50,51],'มหากิริยาอุเบกขาไม่ประกอบญาณ');
// Sublime: 5 levels of rupa-jhana (×3) and the same fifth-jhana pattern for
// the 12 arupa cittas, Table 2.3. Fifth jhana has no karuna/mudita.
register([55,60,65],'1-13, 28-46, 50-52',35,[50,51],'รูปาวจรปฐมฌาน');
register([56,61,66],'1-7, 9-13, 28-46, 50-52',34,[50,51],'รูปาวจรทุติยฌาน');
register([57,62,67],'1-7, 10-13, 28-46, 50-52',33,[50,51],'รูปาวจรตติยฌาน');
register([58,63,68],'1-7, 10, 11, 13, 28-46, 50-52',32,[50,51],'รูปาวจรจตุตถฌาน');
register([59,64,69,...r(70,81)],'1-7, 10, 11, 13, 28-46, 52',30,[],'ปัญจมฌานรูปาวจรและอรูปาวจร');
// Eight supramundane functions × five levels, Table 2.3; virati 47–49
// are all REQUIRED and illimitables 50–51 do not occur.
const lokIds=level=>r(0,7).map(group=>82+5*group+level);
register(lokIds(0),'1-13, 28-49, 52',36,[],'โลกุตตรปฐมฌาน');
register(lokIds(1),'1-7, 9-13, 28-49, 52',35,[],'โลกุตตรทุติยฌาน');
register(lokIds(2),'1-7, 10-13, 28-49, 52',34,[],'โลกุตตรตติยฌาน');
register(lokIds(3),'1-7, 10, 11, 13, 28-49, 52',33,[],'โลกุตตรจตุตถฌาน');
register(lokIds(4),'1-7, 10, 11, 13, 28-49, 52',33,[],'โลกุตตรปัญจมฌาน');

records.sort((a,b)=>a.id-b.id);
if(records.length!==121||records.some((rec,i)=>rec.id!==i+1))throw Error('Source Table 2.3 transcription does not cover 121 cittas');
export const CANONICAL_SAMPAYOGA_SOURCE=Object.freeze(records);
export function sourceForCitta(id){
 if(!Number.isInteger(id)||id<1||id>121)throw new RangeError('Unknown citta source ID');
 return CANONICAL_SAMPAYOGA_SOURCE[id-1];
}
export function manualLink(table='combinations'){
 if(!Object.prototype.hasOwnProperty.call(MANUAL_TABLES,table))throw new RangeError('Unknown manual source');
 return `${BPS_MANUAL_URL}#page=${MANUAL_TABLES[table].pdfPage}`;
}