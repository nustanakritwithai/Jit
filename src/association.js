/**
 * JIT · Sampayoga matrix, canonical citta sequence 1–89 / 1–121.
 * Source: A Comprehensive Manual of Abhidhamma (BPS, Bodhi et al.),
 * Tables 1.1, 1.3, 1.4, 2.2 (p.92), 2.3 (p.101).
 *
 * A matrix cell is mandatory / conditional / prohibited. Eleven cetasikas
 * are conditional adjuncts in their eligible types, never randomly activated.
 * The 89-citta representation groups the five supramundane jhāna variants;
 * its last eight rows therefore have aggregate eligibility, not a fixed mask.
 */
import {FACTORS} from './data.js';

const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>i+a);
const uniques=xs=>[...new Set(xs)].sort((a,b)=>a-b);
const isIn=(id,sets)=>sets.some(([a,b])=>id>=a&&id<=b);
const JHANAS=['ปฐมฌาน','ทุติยฌาน','ตติยฌาน','จตุตถฌาน','ปัญจมฌาน'];
const PATHS=['โสดาปัตติ','สกทาคามิ','อนาคามิ','อรหัต'];
const SENSES=['จักขุวิญญาณ','โสตวิญญาณ','ฆานวิญญาณ','ชิวหาวิญญาณ','กายวิญญาณ'];
const ETHICS={akusala:'อกุศล',kusala:'กุศล',vipaka:'วิบาก',kiriya:'กิริยา'};
const citta121=[];

function add(id,{label,quality,realm,feeling='อุเบกขา',prompted=null,knowledge=null,jhana=null,senseDoor=null,base89=id,kind=null}){
 if(citta121.length!==id-1)throw Error(`Citta sequence breaks at ${id}`);
 citta121.push(Object.freeze({id,id121:id,id89:base89,label,quality,realm,feeling,prompted,knowledge,jhana,senseDoor,kind:kind||realm,fullLabel:`${id}. ${label} · ${ETHICS[quality]} · ${feeling}`}));
}
const promptText=p=>p?'สสังขาริก':'อสังขาริก';
const feelingText=f=>f==='โสมนัส'?'โสมนัส':f==='อุเบกขา'?'อุเบกขา':f;
// 1–8 greed-rooted (somanassa/upekkha × diṭṭhi assoc./dissoc. × prompting).
for(let i=0;i<8;i++){
 const feeling=i<4?'โสมนัส':'อุเบกขา',withView=i%4<2,prompted=i%2===1;
 add(i+1,{label:`โลภมูลจิต ${feelingText(feeling)} ${withView?'ประกอบทิฏฐิ':'ไม่ประกอบทิฏฐิ'} ${promptText(prompted)}`,quality:'akusala',realm:'kama',feeling,prompted,knowledge:false,kind:'lobha'});
}
for(let id=9;id<=10;id++)add(id,{label:`โทสมูลจิต โทมนัส ${promptText(id===10)}`,quality:'akusala',realm:'kama',feeling:'โทมนัส',prompted:id===10,kind:'dosa'});
add(11,{label:'โมหมูลจิตประกอบวิจิกิจฉา',quality:'akusala',realm:'kama',feeling:'อุเบกขา',kind:'moha'});
add(12,{label:'โมหมูลจิตประกอบอุทธัจจะ',quality:'akusala',realm:'kama',feeling:'อุเบกขา',kind:'moha'});
// 13–27: 7 unwholesome resultants and 8 wholesome resultants.
for(let n=0;n<5;n++)add(13+n,{label:`อกุศลวิบาก${SENSES[n]}`,quality:'vipaka',realm:'rootless',feeling:n===4?'ทุกข์':'อุเบกขา',senseDoor:n,kind:'sense-akusala'});
add(18,{label:'อกุศลวิบากสัมปฏิจฉนจิต',quality:'vipaka',realm:'rootless',kind:'receive-akusala'});
add(19,{label:'อกุศลวิบากสันตีรณจิต',quality:'vipaka',realm:'rootless',kind:'investigate-akusala'});
for(let n=0;n<5;n++)add(20+n,{label:`กุศลวิบาก${SENSES[n]}`,quality:'vipaka',realm:'rootless',feeling:n===4?'สุข':'อุเบกขา',senseDoor:n,kind:'sense-kusala'});
add(25,{label:'กุศลวิบากสัมปฏิจฉนจิต',quality:'vipaka',realm:'rootless',kind:'receive-kusala'});
add(26,{label:'กุศลวิบากสันตีรณจิต โสมนัส',quality:'vipaka',realm:'rootless',feeling:'โสมนัส',kind:'investigate-kusala'});
add(27,{label:'กุศลวิบากสันตีรณจิต อุเบกขา',quality:'vipaka',realm:'rootless',kind:'investigate-kusala'});
add(28,{label:'ปัญจทวาราวัชชนจิต',quality:'kiriya',realm:'rootless',kind:'five-advert'});
add(29,{label:'มโนทวาราวัชชนจิต / โวฏฐัพพนจิต',quality:'kiriya',realm:'rootless',kind:'mind-advert'});
add(30,{label:'หสิตุปปาทจิต (จิตทำให้ยิ้ม)',quality:'kiriya',realm:'rootless',feeling:'โสมนัส',kind:'smile'});
// 31–54: eight each of mahākusala, mahāvipāka, mahākiriya.
for(const [start,quality,kind] of [[31,'kusala','maha-kusala'],[39,'vipaka','maha-vipaka'],[47,'kiriya','maha-kiriya']]){
 for(let i=0;i<8;i++){
  const id=start+i,feeling=i<4?'โสมนัส':'อุเบกขา',knowledge=i%4<2,prompted=i%2===1;
  add(id,{label:`มหา${ETHICS[quality]}จิต ${feeling} ${knowledge?'ประกอบญาณ':'ไม่ประกอบญาณ'} ${promptText(prompted)}`,
   quality,realm:'kama-beautiful',kind,feeling,knowledge,prompted});
 }
}
// 55–69: five rūpāvacara jhānas for each ethical quality.
for(const [start,quality] of [[55,'kusala'],[60,'vipaka'],[65,'kiriya']])for(let level=1;level<=5;level++){
 add(start+level-1,{label:`รูปาวจร${ETHICS[quality]}จิต ${JHANAS[level-1]}`,quality,realm:'rupa',jhana:level,feeling:level===5?'อุเบกขา':'โสมนัส',kind:'rupa'});
}
// 70–81: four arūpāvacara attainments per quality.
const ARUPA=['อากาสานัญจายตนะ','วิญญาณัญจายตนะ','อากิญจัญญายตนะ','เนวสัญญานาสัญญายตนะ'];
for(const [start,quality] of [[70,'kusala'],[74,'vipaka'],[78,'kiriya']])for(let level=1;level<=4;level++){
 add(start+level-1,{label:`อรูปาวจร${ETHICS[quality]}จิต ${ARUPA[level-1]}`,quality,realm:'arupa',jhana:5,feeling:'อุเบกขา',kind:'arupa'});
}
// 82–121: 8 supramundane cittas expanded by their five jhāna levels.
for(let group=0;group<8;group++){
 const quality=group<4?'kusala':'vipaka',rank=group%4,
  title=`${PATHS[rank]}${group<4?'มรรค':'ผล'}`;
 for(let level=1;level<=5;level++){
  const id=82+group*5+(level-1);
  add(id,{label:`โลกุตตร${title}จิต ${JHANAS[level-1]}`,quality,realm:'lokuttara',jhana:level,base89:82+group,feeling:level===5?'อุเบกขา':'โสมนัส',kind:group<4?'magga':'phala'});
 }
}

export const CITTAS_121=Object.freeze(citta121);
export const CITTA_BY_121=new Map(CITTAS_121.map(x=>[x.id,x]));

// The 89-citta scheme is a coarser classification; its eight supramundane
// categories intentionally summarize *all five* jhāna variants.
export const CITTAS_89=Object.freeze([
 ...CITTAS_121.slice(0,81).map(x=>({...x,id:x.id89})),
 ...range(82,89).map(id=>{
  const variants=CITTAS_121.filter(c=>c.id89===id);
  return Object.freeze({id,id89:id,id121:null,variants:variants.map(v=>v.id),label:variants[0].label.replace(` ${JHANAS[0]}`,' (รวมฌาน 1–5)'),quality:variants[0].quality,realm:'lokuttara',jhana:null,kind:variants[0].kind,feeling:'ขึ้นกับฌาน'});
 })
]);

// Table 2.2 of Bodhi's Manual: allowed placements for factors 8–13.
function basicOptionals(id){
 const allowed=[];
 if([3,4,7,8].includes(id))allowed.push(20);
 if([9,10].includes(id))allowed.push(22,23,24);
 if([2,4,6,8,10].includes(id))allowed.push(25,26);
 if(id>=31&&id<=38)allowed.push(47,48,49);
 if(isIn(id,[[31,38],[47,54],[55,58],[60,63],[65,68]]))allowed.push(50,51);
 return allowed;
}
function factorRuleFor121(citta){
 const n=citta.id,mandatory=range(1,7),optional=basicOptionals(n);
 const isFirstOfSupra=n>=82&&(n-82)%5===0;
 const isSecondOfSupra=n>=82&&(n-82)%5===1;
 const isThirdOfSupra=n>=82&&(n-82)%5===2;
 // six occasional cetasikas (8–13)
 if(isIn(n,[[1,12],[18,19],[25,54]])||[55,60,65].includes(n)||isFirstOfSupra)mandatory.push(8);
 if(isIn(n,[[1,12],[18,19],[25,54]])||[55,56,60,61,65,66].includes(n)||isFirstOfSupra||isSecondOfSupra)mandatory.push(9);
 if(isIn(n,[[1,10],[12,12],[18,19],[25,121]]))mandatory.push(10);
 if(isIn(n,[[1,12],[29,121]]))mandatory.push(11);
 if([1,2,3,4,26,30].includes(n)||isIn(n,[[31,34],[39,42],[47,50],[55,57],[60,62],[65,67]])||(n>=82&&[0,1,2].includes((n-82)%5)))mandatory.push(12);
 if(isIn(n,[[1,10],[31,121]]))mandatory.push(13);
 // 14 unwholesome factors
 if(n<=12)mandatory.push(14,15,16,17);
 if(n<=8)mandatory.push(18);
 if([1,2,5,6].includes(n))mandatory.push(19);
 if([9,10].includes(n))mandatory.push(21);
 if(n===11)mandatory.push(27);
 // 25 beautiful factors
 if(n>=31)mandatory.push(...range(28,46));
 if(n>=82)mandatory.push(47,48,49);  // concurrent in lokuttara
 if([31,32,35,36,39,40,43,44,47,48,51,52].includes(n)||n>=55)mandatory.push(52);
 const required=uniques(mandatory),possible=uniques(optional);
 if(required.some(x=>possible.includes(x)))throw Error(`Overlapping mandatory/optional at citta ${n}`);
 const prohibited=FACTORS.map(f=>f.id).filter(i=>!required.includes(i)&&!possible.includes(i));
 return Object.freeze({...citta,mandatory:Object.freeze(required),optional:Object.freeze(possible),prohibited:Object.freeze(prohibited)});
}
export const SAMPAYOGA_121=Object.freeze(CITTAS_121.map(factorRuleFor121));
export const SAMPAYOGA_BY_ID=new Map(SAMPAYOGA_121.map(c=>[c.id,c]));
export const SAMPAYOGA_89=Object.freeze(CITTAS_89.map(c=>{
 const rows=(c.variants||[c.id]).map(id=>SAMPAYOGA_BY_ID.get(id));
 const required=rows[0].mandatory.filter(f=>rows.every(r=>r.mandatory.includes(f)));
 const possible=uniques(rows.flatMap(r=>[...r.mandatory,...r.optional])).filter(f=>!required.includes(f));
 const prohibited=FACTORS.map(f=>f.id).filter(id=>!required.includes(id)&&!possible.includes(id));
 return Object.freeze({...c,mandatory:required,optional:possible,prohibited,aggregate:rows.length>1});
}));

export function getSampayoga(id,scheme=121){
 if(!Number.isInteger(id))throw new RangeError('Citta ID must be an integer');
 const found=(scheme===89?SAMPAYOGA_89:scheme===121?SAMPAYOGA_121:null)?.[id-1];
 if(!found)throw new RangeError(`Unknown citta ${id} in scheme ${scheme}`);
 return found;
}
/** Matrix status, not an active-moment claim. */
export function associationStatus(id,cetasikaId,scheme=121){
 const c=getSampayoga(id,scheme);
 if(!Number.isInteger(cetasikaId)||cetasikaId<1||cetasikaId>52)throw new RangeError('Unknown cetasika');
 return c.mandatory.includes(cetasikaId)?'required':c.optional.includes(cetasikaId)?'optional':'forbidden';
}

export function resolveSampayoga(cittaId,requested=[],scheme=121){
 if(scheme!==121)throw Error('Instantiate a specific 121-scheme variant; 89-scheme supramundane rows aggregate 5 jhānas');
 const c=getSampayoga(cittaId,121);
 const choices=uniques(requested);
 if(choices.length!==requested.length)throw Error('Duplicate optional factor');
 for(const id of choices)if(!c.optional.includes(id))throw Error(`Citta ${cittaId} cannot optionally include factor ${id}`);
 if(choices.includes(25)!==choices.includes(26))throw Error('Thīna and middha must co-arise');
 for(const pool of [[22,23,24],[47,48,49],[50,51]])if(choices.filter(id=>pool.includes(id)).length>1)throw Error(`Mutually exclusive adjuncts ${pool.join(',')}`);
 const active=uniques([...c.mandatory,...choices]);
 if(active.length+ c.prohibited.length + (c.optional.length-choices.length)!==52)throw Error('Matrix partition invalid');
 return Object.freeze({citta:c,active,chosen:choices,vector:Object.freeze(Object.fromEntries(FACTORS.map(f=>[f.id,active.includes(f.id)])))});
}

/** Counts for Table 2.2 in the fully-expanded 121 scheme, including allowed optional associations. */
export const TABLE_2_2_COUNTS=Object.freeze({8:55,9:66,10:110,11:105,12:51,13:101,14:12,15:12,16:12,17:12,18:8,19:4,20:4,21:2,22:2,23:2,24:2,25:5,26:5,27:1,47:48,48:48,49:48,50:28,51:28,52:79});
export function associationCoverage(scheme=121){
 const rows=scheme===89?SAMPAYOGA_89:scheme===121?SAMPAYOGA_121:null;
 if(!rows)throw new RangeError('scheme must be 89 or 121');
 return FACTORS.map(f=>({factorId:f.id,name:f.name,required:rows.filter(r=>r.mandatory.includes(f.id)).length,eligible:rows.filter(r=>!r.prohibited.includes(f.id)).length}));
}