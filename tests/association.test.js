import test from 'node:test';
import assert from 'node:assert/strict';
import {FACTORS,GROUPS} from '../src/data.js';
import {CITTAS_89,CITTAS_121,SAMPAYOGA_89,SAMPAYOGA_121,associationStatus,associationCoverage,resolveSampayoga,getSampayoga,TABLE_2_2_COUNTS} from '../src/association.js';

test('canonical 52 factor inventory and complete 89/121 rows',()=>{
 assert.equal(FACTORS.length,52);
 assert.equal(new Set(FACTORS.map(f=>f.id)).size,52);
 assert.deepEqual(GROUPS.map(x=>FACTORS.filter(f=>f.group===x.id).length),[7,6,14,25]);
 assert.equal(CITTAS_121.length,121);assert.equal(CITTAS_89.length,89);
 assert.deepEqual(SAMPAYOGA_121.map(c=>c.id),Array.from({length:121},(_,i)=>i+1));
 assert.deepEqual(SAMPAYOGA_89.map(c=>c.id),Array.from({length:89},(_,i)=>i+1));
 assert.deepEqual([12,18,24,30,54,69,81,121].map(i=>CITTAS_121[i-1].id89),[12,18,24,30,54,69,81,89]);
});

test('121 × 52 cells partition into required/optional/forbidden without overlap',()=>{
 for(const c of SAMPAYOGA_121){
  assert.equal(c.mandatory.length+c.optional.length+c.prohibited.length,52,`row ${c.id}`);
  assert.equal(new Set([...c.mandatory,...c.optional,...c.prohibited]).size,52);
  for(let i=1;i<=7;i++)assert.equal(associationStatus(c.id,i),'required');
  for(let i=1;i<=52;i++)assert.ok(['required','optional','forbidden'].includes(associationStatus(c.id,i)));
  const resolved=resolveSampayoga(c.id);
  assert.deepEqual(resolved.active,c.mandatory);
  assert.equal(Object.keys(resolved.vector).length,52);
 }
});

test('Table 2.2: each factor eligible across precisely the documented number of 121 cittas',()=>{
 const summary=associationCoverage(121);
 for(let i=1;i<=7;i++)assert.equal(summary[i-1].eligible,121);
 for(let i=28;i<=46;i++)assert.equal(summary[i-1].eligible,91);
 for(const [id,total] of Object.entries(TABLE_2_2_COUNTS))assert.equal(summary[Number(id)-1].eligible,total,`factor ${id}`);
});

test('Table 2.3: representative fixed masks for rootless / beautiful resultant / 5-jhana lokuttara',()=>{
 const check=(id,expected,required=true)=>assert.equal(getSampayoga(id).mandatory.length,expected,`citta ${id}`);
 [[11,15],[12,15],[13,7],[17,7],[24,7],[18,10],[26,11],[27,10],[28,10],[29,11],[30,12],[39,33],[41,32],[43,32],[45,31],[82,36],[83,35],[84,34],[85,33],[86,33],[87,36],[121,33]].forEach(([id,n])=>check(id,n));
 assert.equal(getSampayoga(1).mandatory.length,19);
 assert.equal(getSampayoga(9).mandatory.length,17);
 assert.equal(getSampayoga(31).mandatory.length,33);
});

test('conditional adjuncts: mana only when allowed, thina/middha paired, dosa accessories separate',()=>{
 assert.equal(associationStatus(3,20),'optional');assert.equal(associationStatus(1,20),'forbidden');
 assert.equal(associationStatus(4,25),'optional');assert.equal(associationStatus(3,25),'forbidden');
 assert.throws(()=>resolveSampayoga(4,[25]),/co-arise/);
 assert.deepEqual(resolveSampayoga(4,[25,26]).chosen,[25,26]);
 assert.equal(associationStatus(9,22),'optional');
 assert.throws(()=>resolveSampayoga(9,[22,23]),/Mutually exclusive/);
 assert.equal(resolveSampayoga(9,[22]).active.includes(22),true);
 assert.throws(()=>resolveSampayoga(11,[10]),/cannot optionally include/);
});

test('mundane virati separate, supramundane all three fixed; karuna/mudita separate',()=>{
 for(const id of [47,48,49]){
  assert.equal(associationStatus(31,id),'optional');
  assert.equal(associationStatus(82,id),'required');
  assert.equal(associationStatus(47,id),'forbidden');
 }
 assert.throws(()=>resolveSampayoga(31,[47,48]),/Mutually exclusive/);
 assert.throws(()=>resolveSampayoga(31,[50,51]),/Mutually exclusive/);
 assert.ok(resolveSampayoga(31,[47,50]).active.includes(50));
 assert.equal(associationStatus(86,50),'forbidden');
 assert.equal(associationStatus(68,51),'optional');
 assert.equal(associationStatus(69,51),'forbidden');
});

test('89 scheme groups 5 supramundane jhanas (not a single forced first jhana)',()=>{
 const lump=getSampayoga(82,89);
 assert.equal(lump.aggregate,true);assert.deepEqual(lump.variants,[82,83,84,85,86]);
 assert.equal(associationStatus(82,8,89),'optional');
 assert.equal(associationStatus(82,9,89),'optional');
 assert.equal(associationStatus(82,12,89),'optional');
 assert.equal(associationStatus(82,47,89),'required');
 assert.throws(()=>resolveSampayoga(82,[],89),/121-scheme/);
});

test('not every factor eligible in all 121 cittas, and all 52 are possible in some valid context',()=>{
 const covered=new Set(SAMPAYOGA_121.flatMap(c=>[...c.mandatory,...c.optional]));
 assert.deepEqual([...covered].sort((a,b)=>a-b),FACTORS.map(f=>f.id));
 assert.equal(associationStatus(13,52),'forbidden');
 assert.equal(associationStatus(55,52),'required');
 assert.throws(()=>getSampayoga(122),/Unknown citta/);
 assert.throws(()=>getSampayoga(0),/Unknown citta/);
});


test('all 40 concrete lokuttara rows instantiate and pass process association validation', async()=>{
 const {validateAssociations}=await import('../src/engine.js');
 for(let id=82;id<=121;id++){
  const sample=resolveSampayoga(id);
  assert.ok([47,48,49].every(f=>sample.active.includes(f)),`lokuttara ${id} must have three virati`);
  assert.equal(validateAssociations({cittaId:id,family:sample.citta.quality,ids:sample.active}),true);
 }
});


test('every one of 121 canonical citta masks passes the complete cross-factor validator', async()=>{
 const {validateAssociations}=await import('../src/engine.js');
 for(const row of SAMPAYOGA_121){
  const resolved=resolveSampayoga(row.id);
  assert.equal(validateAssociations({cittaId:row.id,family:row.quality,ids:resolved.active}),true,`citta ${row.id}`);
 }
});