/** JIT V0.6 — Rūpa source-constrained catalog.
 * Source levels are deliberately separate:
 *  R0: Dhammasaṅgaṇī Rūpakaṇḍa (canonical categories).
 *  R1: Abhidhammatthasaṅgaha, chapter VI (the 28/21 enumerations).
 * This is a taxonomic/conditionality explorer, NOT an actual rūpa-production
 * solver, not a medical model, and not a proof of a person's citta.
 */
export const RUPA_SOURCES = Object.freeze({
 canonical: Object.freeze({tier:'พระอภิธรรมปิฎก',title:'ธัมมสังคณี รูปกัณฑ์ — รูปวิภัตติ',url:'https://dhammatalks.net/suttacentral/sc2016/sc/pi/ds2.2.3.html'}),
 manual: Object.freeze({tier:'คู่มืออภิธรรม/แนวอรรถกถา',title:'อภิธัมมัตถสังคหะ บทที่ 6 รูปสังคหะ',url:'https://www.ruyimeditation.org/theravada/abhidhamma/rupa-sangaha/'}),
 manualBps: Object.freeze({tier:'ฉบับขยายความ',title:'A Comprehensive Manual of Abhidhamma, Chapter VI',url:'https://www.bps.lk/olib/bp/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf'})
});

const rawGroups = [
 ['element','มหาภูตรูป',4],['sensitivity','ปสาทรูป',5],['object','โคจรรูป (นับรูปเฉพาะ 4)',4],
 ['sex','ภาวรูป',2],['heart','หทยรูป',1],['life','ชีวิตรูป',1],['nutriment','อาหารรูป',1],
 ['space','ปริจเฉทรูป',1],['intimation','วิญญัติรูป',2],['mutability','วิการรูป (ไม่รวมวิญญัติที่นับไปแล้ว)',3],
 ['characteristic','ลักขณรูป',4]
];
export const RUPA_GROUPS = Object.freeze(rawGroups.map(([id,name,count])=>Object.freeze({id,name,count})));
// Each row is a DISTINCT rupa type. Tangibility (phoṭṭhabba) has NO separate ID:
// it consists of earth, fire and air elements. Water/cohesion is excluded.
const raw = [
 [1,'ปฐวีธาตุ','Paṭhavīdhātu','element','ลักษณะแข็ง–อ่อน / ความต้านทาน'],
 [2,'อาโปธาตุ','Āpodhātu','element','ลักษณะเกาะกุม / ประสาน'],
 [3,'เตโชธาตุ','Tejodhātu','element','ลักษณะร้อน–เย็น / อุณหภูมิ'],
 [4,'วาโยธาตุ','Vāyodhātu','element','ลักษณะตึง–ไหว / การค้ำจุน'],
 [5,'จักขุปสาทรูป','Cakkhupasāda','sensitivity','รูปที่เป็นฐานของจักขุวิญญาณ ไม่ใช่ลูกตาทั้งลูก'],
 [6,'โสตปสาทรูป','Sotapasāda','sensitivity','รูปที่เป็นฐานของโสตวิญญาณ'],
 [7,'ฆานปสาทรูป','Ghānapasāda','sensitivity','รูปที่เป็นฐานของฆานวิญญาณ'],
 [8,'ชิวหาปสาทรูป','Jivhāpasāda','sensitivity','รูปที่เป็นฐานของชิวหาวิญญาณ'],
 [9,'กายปสาทรูป','Kāyapasāda','sensitivity','รูปที่เป็นฐานของกายวิญญาณ'],
 [10,'วัณณรูป (รูปารมณ์)','Rūpāyatana','object','สิ่งที่เห็นได้ / สี'],
 [11,'สัททรูป','Saddāyatana','object','เสียงที่ได้ยิน'],
 [12,'คันธรูป','Gandhāyatana','object','กลิ่น'],
 [13,'รสรูป','Rasāyatana','object','รส'],
 [14,'อิตถีภาวรูป','Itthibhāva','sex','รูปแสดงภาวะหญิงตามการแจกแจงทางอภิธรรม'],
 [15,'ปุริสภาวรูป','Purisabhāva','sex','รูปแสดงภาวะชายตามการแจกแจงทางอภิธรรม'],
 [16,'หทยวัตถุรูป','Hadayavatthu','heart','วัตถุรองรับจิตตามคำอธิบายในสายอภิธัมมัตถสังคหะ'],
 [17,'รูปชีวิตินทรีย์','Rūpajīvitindriya','life','รูปที่รักษารูปกรรมชะที่เกิดร่วม ไม่ใช่นามชีวิตินทรีย์'],
 [18,'โอชารูป','Ojā / Kabaḷīkārāhāra','nutriment','สารอาหารหรือโอชาที่เป็นรูป'],
 [19,'อากาสธาตุ (ปริจเฉทรูป)','Ākāsadhātu','space','ช่องว่างจำกัดกลาปรูป ไม่ใช่องค์ประกอบภายในกลาป'],
 [20,'กายวิญญัติรูป','Kāyaviññatti','intimation','อาการแสดงเจตนาทางกาย'],
 [21,'วจีวิญญัติรูป','Vacīviññatti','intimation','อาการแสดงเจตนาทางวาจา'],
 [22,'รูปลหุตา','Rūpassa lahutā','mutability','ความเบาคล่องของรูป'],
 [23,'รูปมุทุตา','Rūpassa mudutā','mutability','ความอ่อนตัวของรูป'],
 [24,'รูปกัมมัญญตา','Rūpassa kammaññatā','mutability','ความควรแก่การงานของรูป'],
 [25,'รูปอุปจยะ','Rūpassa upacaya','characteristic','การก่อตัว/เกิดขึ้น (แง่หนึ่งของชาติรูป)'],
 [26,'รูปสันตติ','Rūpassa santati','characteristic','ความสืบต่อของการเกิดรูป (แง่หนึ่งของชาติรูป)'],
 [27,'รูปชรตา','Rūpassa jaratā','characteristic','ความเสื่อม/แก่ของรูป'],
 [28,'รูปอนิจจตา','Rūpassa aniccatā','characteristic','ความแตกดับของรูป']
];
export const RUPA_28=Object.freeze(raw.map(([id,name,pali,group,description])=>Object.freeze({
 id,name,pali,group,description,kind:id<=18?'concrete':'nonconcrete',
 source:group==='heart'?'manual':group==='characteristic'?'manual':'manual'
})));
export const RUPA_BY_ID = new Map(RUPA_28.map(r=>[r.id,r]));
export const CONCRETE_RUPA = Object.freeze(RUPA_28.filter(r=>r.kind==='concrete').map(r=>r.id));
export const NONCONCRETE_RUPA = Object.freeze(RUPA_28.filter(r=>r.kind==='nonconcrete').map(r=>r.id));
export const AVINIBBHOGA_8 = Object.freeze([1,2,3,4,10,12,13,18]);
export const PHOTTHABBA_3 = Object.freeze([1,3,4]);
export const MUTABILITY_TRIAD = Object.freeze([22,23,24]);

// Chapter VI: kamma, citta, utu, āhāra each can produce certain categories.
// Eligible cause here NEVER implies actual arising; space delimitation is not a
// member of the kalāpa and the four lakkhaṇas are NOT separately produced.
const ORIGIN_IDS=Object.freeze({
 kamma:Object.freeze([...AVINIBBHOGA_8,5,6,7,8,9,14,15,16,17,19]),
 citta:Object.freeze([...AVINIBBHOGA_8,11,19,20,21,...MUTABILITY_TRIAD]),
 utu:Object.freeze([...AVINIBBHOGA_8,11,19,...MUTABILITY_TRIAD]),
 ahara:Object.freeze([...AVINIBBHOGA_8,19,...MUTABILITY_TRIAD])
});
export const RUPA_ORIGINS=Object.freeze(Object.entries(ORIGIN_IDS).map(([id,ids])=>Object.freeze({id,rupaIds:ids,count:ids.length})));
export function potentialOrigins(rupaId){
 if(!RUPA_BY_ID.has(rupaId))throw new RangeError('Unknown rūpa ID');
 return Object.freeze(RUPA_ORIGINS.filter(o=>o.rupaIds.includes(rupaId)).map(o=>o.id));
}
// Twenty-one *named* standard rūpa-kalāpas of Chapter VI. Members omit space
// and characteristics: these delimit/characterize groups, are not group members.
const groups=[];
function addKalapa(id,name,origin,additions){
 const members=Object.freeze([...AVINIBBHOGA_8,...additions].sort((a,b)=>a-b));
 if(new Set(members).size!==members.length||members.some(x=>![...ORIGIN_IDS[origin]].includes(x)||[19,25,26,27,28].includes(x)))throw Error('Invalid canonical kalāpa fixture');
 groups.push(Object.freeze({id,name,origin,members,count:members.length,
  externalPossible:id==='temperature-octad'||id==='temperature-sound-nonad',
  sourceSection:'อภิธัมมัตถสังคหะ บทที่ 6 รูปกลาป §§17–21'}));
}
for(const [id,name,rid] of [
 ['eye-decad','จักขุทสกกลาป',5],['ear-decad','โสตทสกกลาป',6],['nose-decad','ฆานทสกกลาป',7],
 ['tongue-decad','ชิวหาทสกกลาป',8],['body-decad','กายทสกกลาป',9],['female-decad','อิตถีภาวทสกกลาป',14],
 ['male-decad','ปุริสภาวทสกกลาป',15],['heart-decad','วัตถุทสกกลาป',16]
])addKalapa(id,name,'kamma',[17,rid]);
addKalapa('life-nonad','ชีวิตนวกกลาป','kamma',[17]);
addKalapa('mind-octad','จิตตชสุทธัฏฐกกลาป','citta',[]);
addKalapa('body-intimation-nonad','กายวิญญัตินวกกลาป','citta',[20]);
addKalapa('speech-intimation-decad','วจีวิญญัติทสกกลาป','citta',[11,21]);
addKalapa('mind-lightness-undecad','จิตตชลหุตาทิเอกาทสกกลาป','citta',MUTABILITY_TRIAD);
addKalapa('body-lightness-dodecad','กายวิญญัติลหุตาทิทวาทสกกลาป','citta',[20,...MUTABILITY_TRIAD]);
addKalapa('speech-lightness-tridecad','วจีวิญญัติสัททลหุตาทิเตรสกกลาป','citta',[11,21,...MUTABILITY_TRIAD]);
addKalapa('temperature-octad','อุตุชสุทธัฏฐกกลาป','utu',[]);
addKalapa('temperature-sound-nonad','อุตุชสัททนวกกลาป','utu',[11]);
addKalapa('temperature-lightness-undecad','อุตุชลหุตาทิเอกาทสกกลาป','utu',MUTABILITY_TRIAD);
addKalapa('temperature-sound-lightness-dodecad','อุตุชสัททลหุตาทิทวาทสกกลาป','utu',[11,...MUTABILITY_TRIAD]);
addKalapa('nutriment-octad','อาหารชสุทธัฏฐกกลาป','ahara',[]);
addKalapa('nutriment-lightness-undecad','อาหารชลหุตาทิเอกาทสกกลาป','ahara',MUTABILITY_TRIAD);
export const KALAPAS_21 = Object.freeze(groups);
export function getKalapa(id){const k=KALAPAS_21.find(k=>k.id===id);if(!k)throw new RangeError('Unknown kalāpa');return k;}
export function evaluateKalapa(origin,memberIds){
 if(!Object.hasOwn(ORIGIN_IDS,origin))throw new RangeError('Unknown material origin');
 if(!Array.isArray(memberIds)||memberIds.some(id=>!RUPA_BY_ID.has(id))||new Set(memberIds).size!==memberIds.length)throw new TypeError('Invalid material member IDs');
 const match=KALAPAS_21.find(k=>k.origin===origin&&k.members.length===memberIds.length&&k.members.every(id=>memberIds.includes(id)));
 return Object.freeze({status:match?'MATCHES_CHAPTER_VI_TEMPLATE':'UNSUPPORTED_COMBINATION',kalapaId:match?.id??null,
  reason:match?'รูปกลาปตรงกับแบบแจกแจงในคู่มือบทที่ 6':'ยังไม่ตรงกับรูปกลาปหนึ่งใน 21 แบบที่ระบบรับรอง ไม่อ้างว่าไม่มีรูปนั้นในทุกบริบท'});
}

export const SENSE_RUPA_SUPPORT=Object.freeze({
 13:{door:'eye',base:5,objectChoices:[10]},20:{door:'eye',base:5,objectChoices:[10]},
 14:{door:'ear',base:6,objectChoices:[11]},21:{door:'ear',base:6,objectChoices:[11]},
 15:{door:'nose',base:7,objectChoices:[12]},22:{door:'nose',base:7,objectChoices:[12]},
 16:{door:'tongue',base:8,objectChoices:[13]},23:{door:'tongue',base:8,objectChoices:[13]},
 17:{door:'body',base:9,objectChoices:[1,3,4]},24:{door:'body',base:9,objectChoices:[1,3,4]}
});
/**
 * The app can establish a conditional pair of rūpa inputs ONLY when the
 * user explicitly supplies their presence as a teaching scenario.
 * Unknown is never false, and scenario inputs NEVER establish actual citta.
 */
export function assessSenseSupport(cittaId,{basePresent=null,objectPresent=null,objectRupaId=null}={}){
 if(!Number.isInteger(cittaId)||cittaId<1||cittaId>121)throw new RangeError('Unknown citta ID');
 const support=SENSE_RUPA_SUPPORT[cittaId];
 if(!support)return Object.freeze({status:'NOT_APPLICABLE',cittaId,baseId:null,objectChoices:[],source:RUPA_SOURCES.manual,
  reason:'นี่ไม่ใช่ปัญจวิญญาณ 10 ประเภท ระบบยังไม่ได้กำหนดวัตถุรูปให้จิตประเภทอื่นโดยอัตโนมัติ'});
 for(const v of [basePresent,objectPresent])if(v!==null&&typeof v!=='boolean')throw new TypeError('Presence must be true, false, or null');
 if(objectRupaId!==null&&!support.objectChoices.includes(objectRupaId))throw new RangeError('Object does not match this sense door');
 let status,reason;
 if(basePresent===false||objectPresent===false){status='BLOCKED_IN_DECLARED_SCENARIO';reason='ข้อสมมติของฉากระบุว่าขาดฐานหรืออารมณ์ที่จำเป็นสำหรับวิญญาณทางทวารนี้';}
 else if(basePresent===true&&objectPresent===true){status='CONDITIONAL_ON_SCENARIO';reason='ผู้ใช้สมมติว่ามีฐานและอารมณ์ประเภทที่สัมพันธ์กัน แต่ยังพิสูจน์จิตจริงไม่ได้ และยังไม่ทราบอายุรูป/ปัจจัยทุกข้อ';}
 else{status='UNKNOWN';reason='ไม่มีข้อมูลยืนยันว่าฐานรูปและอารมณ์ประเภทนี้มีอยู่ในฉากที่ศึกษา';}
 return Object.freeze({status,cittaId,door:support.door,baseId:support.base,objectChoices:Object.freeze([...support.objectChoices]),
  objectRupaId,reason,source:RUPA_SOURCES.manual,
  paccaya:{purejata:'UNKNOWN',nissaya:'UNKNOWN',indriya:'UNKNOWN',vippayutta:'UNKNOWN'},
  limitation:'อายุรูปและการเกิดจริงในขณะจิตไม่ได้รับการสังเกต; ไม่ยืนยันปุเรชาต นิสสย อินทริย หรือวิปปยุตตปัจจัยจากสองตัวเลือกนี้'});
}

if(RUPA_28.length!==28||RUPA_GROUPS.reduce((s,g)=>s+g.count,0)!==28||CONCRETE_RUPA.length!==18||NONCONCRETE_RUPA.length!==10||KALAPAS_21.length!==21)
 throw new Error('Rūpa reference registration failed');
