import test from 'node:test';
import assert from 'node:assert/strict';
import {
 RUPA_28,RUPA_BY_ID,RUPA_GROUPS,CONCRETE_RUPA,NONCONCRETE_RUPA,
 AVINIBBHOGA_8,PHOTTHABBA_3,RUPA_ORIGINS,potentialOrigins,
 KALAPAS_21,getKalapa,evaluateKalapa,SENSE_RUPA_SUPPORT,assessSenseSupport,RUPA_SOURCES
} from '../src/rupa.js';
import {buildRupaCsv} from '../src/rupa-ui.js';

test('Abhidhammatthasaṅgaha VI: 28 unique rūpa and 11 named groups',()=>{
 assert.equal(RUPA_28.length,28);
 assert.deepEqual(RUPA_28.map(r=>r.id),Array.from({length:28},(_,i)=>i+1));
 assert.equal(new Set(RUPA_28.map(r=>r.id)).size,28);
 assert.deepEqual(RUPA_GROUPS.map(x=>x.count),[4,5,4,2,1,1,1,1,2,3,4]);
 for(const g of RUPA_GROUPS)assert.equal(RUPA_28.filter(r=>r.group===g.id).length,g.count);
});

test('CMA VI: exactly 18 concrete and 10 non-concrete; no 29th tangible rūpa',()=>{
 assert.deepEqual(CONCRETE_RUPA,Array.from({length:18},(_,i)=>i+1));
 assert.deepEqual(NONCONCRETE_RUPA,Array.from({length:10},(_,i)=>i+19));
 assert.equal(RUPA_BY_ID.has(29),false);
 assert.deepEqual(PHOTTHABBA_3,[1,3,4]);
 assert.equal(PHOTTHABBA_3.includes(2),false,'cohesion (āpo) is not tangibility');
});

test('CMA VI: origin classes count 18/15/13/12 respectively, without duplications',()=>{
 assert.deepEqual(RUPA_ORIGINS.map(x=>x.id),['kamma','citta','utu','ahara']);
 assert.deepEqual(RUPA_ORIGINS.map(x=>x.count),[18,15,13,12]);
 for(const origin of RUPA_ORIGINS){assert.equal(new Set(origin.rupaIds).size,origin.rupaIds.length);assert.equal(origin.rupaIds.length,origin.count);}
});

test('CMA VI: nine kamma-only classes, citta-only intimations and four unproduced characteristics',()=>{
 for(const id of [5,6,7,8,9,14,15,16,17])assert.deepEqual(potentialOrigins(id),['kamma']);
 for(const id of [20,21])assert.deepEqual(potentialOrigins(id),['citta']);
 for(const id of [25,26,27,28])assert.deepEqual(potentialOrigins(id),[]);
 for(const id of AVINIBBHOGA_8)assert.deepEqual(potentialOrigins(id),['kamma','citta','utu','ahara']);
 assert.deepEqual(potentialOrigins(19),['kamma','citta','utu','ahara']);
});

test('CMA VI: 21 canonical material groups partition 9/6/4/2',()=>{
 assert.equal(KALAPAS_21.length,21);
 assert.equal(new Set(KALAPAS_21.map(x=>x.id)).size,21);
 for(const [origin,count] of [['kamma',9],['citta',6],['utu',4],['ahara',2]])assert.equal(KALAPAS_21.filter(x=>x.origin===origin).length,count);
});

test('all 21 kalāpa have eight inseparables and exclude space & four characteristics',()=>{
 for(const k of KALAPAS_21){
  assert.equal(k.count,k.members.length,k.id);
  assert.equal(new Set(k.members).size,k.count);
  assert.ok(AVINIBBHOGA_8.every(id=>k.members.includes(id)),k.id);
  assert.ok([19,25,26,27,28].every(id=>!k.members.includes(id)),k.id);
  assert.equal(evaluateKalapa(k.origin,k.members).kalapaId,k.id);
  assert.equal(evaluateKalapa(k.origin,[...k.members].reverse()).status,'MATCHES_CHAPTER_VI_TEMPLATE');
 }
});

test('kamma decads and vital nonad have exactly ten / nine rūpa',()=>{
 for(const id of ['eye-decad','ear-decad','nose-decad','tongue-decad','body-decad','female-decad','male-decad','heart-decad']){
  const k=getKalapa(id);assert.equal(k.origin,'kamma');assert.equal(k.count,10);assert.ok(k.members.includes(17));
 }
 assert.equal(getKalapa('life-nonad').count,9);
});

test('citta speech intimation group has sound; temperature sound group does not claim speech intimation',()=>{
 const speech=getKalapa('speech-intimation-decad');
 assert.deepEqual(speech.members.filter(id=>![...AVINIBBHOGA_8].includes(id)),[11,21]);
 assert.equal(getKalapa('temperature-sound-nonad').members.includes(21),false);
 assert.equal(getKalapa('speech-lightness-tridecad').count,13);
 assert.equal(getKalapa('temperature-sound-lightness-dodecad').count,12);
});

test('invalid kalāpa is not silently canonized or accepted as a proof of production',()=>{
 assert.equal(evaluateKalapa('kamma',[1,2,3]).status,'UNSUPPORTED_COMBINATION');
 assert.equal(evaluateKalapa('citta',[...AVINIBBHOGA_8,19]).status,'UNSUPPORTED_COMBINATION');
 assert.throws(()=>evaluateKalapa('bogus',[...AVINIBBHOGA_8]),/Unknown material origin/);
 assert.throws(()=>evaluateKalapa('citta',[1,1]),/Invalid material member IDs/);
 assert.throws(()=>potentialOrigins(29),/Unknown rūpa ID/);
 assert.throws(()=>getKalapa('unknown'),/Unknown kalāpa/);
});

test('ten sense consciousnesses map only to appropriate five rūpa bases/objects',()=>{
 assert.equal(Object.keys(SENSE_RUPA_SUPPORT).length,10);
 const expected=[[13,5,[10]],[20,5,[10]],[14,6,[11]],[21,6,[11]],[15,7,[12]],[22,7,[12]],[16,8,[13]],[23,8,[13]],[17,9,[1,3,4]],[24,9,[1,3,4]]];
 for(const [citta,base,objects] of expected){const e=assessSenseSupport(citta);assert.equal(e.baseId,base);assert.deepEqual(e.objectChoices,objects);assert.equal(e.status,'UNKNOWN');}
 assert.equal(assessSenseSupport(31).status,'NOT_APPLICABLE');
});

test('a declared presence is only conditional, not a confirmed real citta or full paccaya',()=>{
 for(const citta of Object.keys(SENSE_RUPA_SUPPORT).map(Number)){
  const yes=assessSenseSupport(citta,{basePresent:true,objectPresent:true});
  assert.equal(yes.status,'CONDITIONAL_ON_SCENARIO');
  assert.equal(yes.paccaya.purejata,'UNKNOWN');
  assert.equal(yes.paccaya.indriya,'UNKNOWN');
  assert.equal(yes.paccaya.nissaya,'UNKNOWN');
  assert.equal(yes.paccaya.vippayutta,'UNKNOWN');
  assert.equal(assessSenseSupport(citta,{basePresent:false,objectPresent:true}).status,'BLOCKED_IN_DECLARED_SCENARIO');
  assert.equal(assessSenseSupport(citta,{basePresent:true,objectPresent:false}).status,'BLOCKED_IN_DECLARED_SCENARIO');
  assert.equal(assessSenseSupport(citta,{basePresent:null,objectPresent:true}).status,'UNKNOWN');
 }
});

test('fail closed for invalid sense-object pairings or invented certainty',()=>{
 assert.throws(()=>assessSenseSupport(13,{objectRupaId:11}),/does not match/);
 assert.throws(()=>assessSenseSupport(17,{objectRupaId:2}),/does not match/);
 assert.equal(assessSenseSupport(17,{objectRupaId:3}).objectRupaId,3);
 assert.throws(()=>assessSenseSupport(20,{basePresent:'yes'}),/Presence/);
 assert.throws(()=>assessSenseSupport(122),/Unknown citta/);
});

test('sources distinguish canon Dhammasaṅgaṇī from later manual Chapter VI',()=>{
 assert.match(RUPA_SOURCES.canonical.url,/ds2\.2\.3/);
 assert.match(RUPA_SOURCES.manual.url,/rupa-sangaha/);
 assert.notEqual(RUPA_SOURCES.canonical.tier,RUPA_SOURCES.manual.tier);
 assert.ok(RUPA_28.every(x=>x.name&&x.pali&&x.description));
});

test('CSV export contains all 28 physical categories and four origin descriptions',()=>{
 const csv=buildRupaCsv().replace(/^\uFEFF/,'').split('\r\n');
 assert.equal(csv.length,29);
 assert.match(csv[0],/สมุฏฐาน/);
 assert.match(csv[5],/จักขุ/);
 assert.match(csv[28],/อนิจจตา/);
});
