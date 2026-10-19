/** JIT V0.7 — Rūpa–Nāma: source-constrained cases for five-sense citta only.
 * Canonical source: Paṭṭhāna, Paccayaniddesa §§2,8,10,16,20,21,24.
 * Presence/timing is USER-DECLARED, not observed. UNKNOWN ≠ false;
 * CONDITIONAL_ON_SCENARIO ≠ proof that a consciousness has occurred.
 */
import {SENSE_RUPA_SUPPORT,RUPA_BY_ID} from './rupa.js';

export const RUPA_NAMA_SOURCES=Object.freeze({
 pali:'https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html',
 english:'https://dhammatalks.net/suttacentral/sc2016/sc/en/patthana1.1.html',
 vithi:'https://www.ruyimeditation.org/theravada/abhidhamma/vithi-sangaha/',
 explanation:'https://www.abhidhamma.org/study/conditionality-of-life/index.html',
 vippayuttaCase:'https://dharma.inti.foundation/en/scripture/theravada/abhidhamma-pitaka/patthana1.18'
});
export const RUPA_NAMA_STATUSES=Object.freeze({
 UNKNOWN:'UNKNOWN',CONDITIONAL:'CONDITIONAL_ON_SCENARIO',
 BLOCKED:'BLOCKED_IN_DECLARED_SCENARIO',NOT_EVALUATED:'NOT_EVALUATED'
});
export const FIVE_SENSE_RELATIONS=Object.freeze([
 {id:'arammana',number:2,name:'อารัมมณปัจจัย',roles:['object']},
 {id:'nissaya',number:8,name:'นิสสยปัจจัย',roles:['base']},
 {id:'purejata',number:10,name:'ปุเรชาตปัจจัย',roles:['base','object']},
 {id:'indriya',number:16,name:'อินทริยปัจจัย',roles:['base']},
 // §20 prenascent dissociation here is only the appropriate *sense base*.
 {id:'vippayutta',number:20,name:'วิปปยุตตปัจจัย (ปุเรชาตวิปปยุตต)',roles:['base']},
 {id:'atthi',number:21,name:'อัตถิปัจจัย',roles:['base','object']},
 {id:'avigata',number:24,name:'อวิคตปัจจัย',roles:['base','object']}
].map(x=>Object.freeze({...x,roles:Object.freeze(x.roles)})));
export const DECLARED_RUPA_TIMING=Object.freeze(['unknown','prior-present','newly-arisen','dissolving','ceased']);

function readRupa(role,provided,allowed){
 if(provided===undefined)provided={};
 if(provided===null||Array.isArray(provided)||typeof provided!=='object')throw new TypeError(role+': expected material object');
 if(Object.keys(provided).some(k=>!['rupaId','present','timing'].includes(k)))throw new TypeError(role+': unknown material input');
 const rupaId=provided.rupaId??allowed[0];
 if(!Number.isInteger(rupaId)||!RUPA_BY_ID.has(rupaId)||!allowed.includes(rupaId))throw new RangeError(role+': incompatible rūpa for sense door');
 const present=provided.present??null,timing=provided.timing??'unknown';
 if(present!==null&&typeof present!=='boolean')throw new TypeError(role+': presence must be true/false/null');
 if(!DECLARED_RUPA_TIMING.includes(timing))throw new RangeError(role+': unknown timing');
 if((present===true&&timing==='ceased')||(present===false&&timing==='prior-present'))throw new Error(role+': contradictory declared presence and timing');
 return Object.freeze({rupaId,present,timing});
}
function judge(i){
 if(i.present===false||['ceased','newly-arisen','dissolving'].includes(i.timing))return RUPA_NAMA_STATUSES.BLOCKED;
 if(i.present===true&&i.timing==='prior-present')return RUPA_NAMA_STATUSES.CONDITIONAL;
 return RUPA_NAMA_STATUSES.UNKNOWN;
}

/** One conditional sense-base/object pair, NEVER empirical inference. */
export function assessRupaNama(cittaId,scenario={}){
 if(!Number.isInteger(cittaId)||cittaId<1||cittaId>121)throw new RangeError('Unknown citta ID');
 if(scenario===null||Array.isArray(scenario)||typeof scenario!=='object')throw new TypeError('Invalid rūpa–nāma scenario');
 if(Object.keys(scenario).some(k=>!['base','object'].includes(k)))throw new TypeError('Unexpected scenario parameter');
 const pair=SENSE_RUPA_SUPPORT[cittaId];
 if(!pair)return Object.freeze({cittaId,status:RUPA_NAMA_STATUSES.NOT_EVALUATED,
  scope:'five-sense-consciousness-only',evidence:Object.freeze([]),
  unknownConditions:Object.freeze(['purejata','nissaya','indriya','vippayutta'])});
 const base=readRupa('base',scenario.base,[pair.base]);
 const object=readRupa('object',scenario.object,pair.objectChoices);
 const inputs={base,object},statusByRole={base:judge(base),object:judge(object)};
 const evidence=[];
 for(const rel of FIVE_SENSE_RELATIONS)for(const role of rel.roles){
  const i=inputs[role],status=statusByRole[role];
  evidence.push(Object.freeze({
   conditionId:rel.id,conditionNumber:rel.number,conditionName:rel.name,role,
   rupaId:i.rupaId,status,basis:'canonical-definition+declared-scenario',
   subtype:rel.id==='vippayutta'?'purejata-vippayutta':null,
   source:Object.freeze({tier:'พระอภิธรรมปิฎก',locator:'Paccayaniddesa §'+rel.number,
    pali:RUPA_NAMA_SOURCES.pali,english:RUPA_NAMA_SOURCES.english,
    appliedCase:rel.id==='vippayutta'?RUPA_NAMA_SOURCES.vippayuttaCase:null}),
   explanation:status===RUPA_NAMA_STATUSES.CONDITIONAL?'รูปเกิดก่อนและยังตั้งอยู่ตามสมมติฐาน ไม่ใช่หลักฐานว่าจิตเกิดจริง':
    status===RUPA_NAMA_STATUSES.BLOCKED?'ขัดกับเงื่อนไขรูปเกิดก่อนและยังตั้งอยู่ของฉากที่ระบุ':
    'UNKNOWN: ยังไม่มีข้อมูลรูปเพียงพอ'
  }));
 }
 const status=evidence.some(x=>x.status===RUPA_NAMA_STATUSES.BLOCKED)?RUPA_NAMA_STATUSES.BLOCKED:
  evidence.every(x=>x.status===RUPA_NAMA_STATUSES.CONDITIONAL)?RUPA_NAMA_STATUSES.CONDITIONAL:RUPA_NAMA_STATUSES.UNKNOWN;
 const missing=[];
 for(const [role,i] of Object.entries(inputs)){
  if(i.present===null)missing.push(role+': ไม่ทราบว่ารูปมีอยู่หรือไม่');
  if(i.timing==='unknown')missing.push(role+': ไม่ทราบว่ารูปเกิดก่อนและยังตั้งอยู่หรือไม่');
 }
 return Object.freeze({cittaId,door:pair.door,status,scope:'five-sense-consciousness-only',
  base,object,evidence:Object.freeze(evidence),missing:Object.freeze(missing),
  unknownConditions:Object.freeze(['pacchajata','upanissaya']),
  limitation:'ไม่ตรวจอายุรูป 17 ขณะจิตหรือจิตจริง ไม่คำนวณปัฏฐานทั้งระบบ',
  sources:RUPA_NAMA_SOURCES});
}
export function validateRupaNamaAssessment(r){
 if(!r||typeof r!=='object'||!Number.isInteger(r.cittaId))throw new TypeError('Malformed rūpa–nāma assessment');
 if(r.status==='CONFIRMED'||r.evidence?.some(x=>x.status==='CONFIRMED'))throw new Error('CONFIRMED is unsupported');
 const expected=assessRupaNama(r.cittaId,r.status==='NOT_EVALUATED'?{}:{base:r.base,object:r.object});
 if(JSON.stringify(r)!==JSON.stringify(expected))throw new Error('Tampered or missing doctrinal proof');
 return true;
}
