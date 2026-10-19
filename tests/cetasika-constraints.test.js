import test from 'node:test';
import assert from 'node:assert/strict';
import {associationStatus} from '../src/association.js';
import {OCCASIONAL_IDS,OCCASIONAL_RULES,documentedPlacement,inspectOccasionalFactor,inspectOccasionalCitta,validateOccasionalExample,verifyOccasionalMatrix} from '../src/cetasika-constraints.js';
const r=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const optional={20:[3,4,7,8],22:[9,10],23:[9,10],24:[9,10],25:[2,4,6,8,10],26:[2,4,6,8,10],
 47:r(31,38),48:r(31,38),49:r(31,38),50:[...r(31,38),...r(47,54),...r(55,58),...r(60,63),...r(65,68)],51:[...r(31,38),...r(47,54),...r(55,58),...r(60,63),...r(65,68)]};
test('manual II §10: exactly 11 occasional adjuncts',()=>{
 assert.deepEqual(OCCASIONAL_IDS,[20,22,23,24,25,26,47,48,49,50,51]);
 assert.deepEqual(OCCASIONAL_RULES.map(x=>x.id),OCCASIONAL_IDS);
 assert.throws(()=>inspectOccasionalFactor(31,8),/Not an aniyata-yogi/);
});
test('all 121 × 11 placement cells independently match the manual and citta matrix',()=>{
 let checked=0;
 for(const id of OCCASIONAL_IDS)for(let c=1;c<=121;c++){
  const expected=id>=47&&id<=49&&c>=82?'required':optional[id].includes(c)?'optional':'forbidden';
  assert.equal(documentedPlacement(c,id),expected);
  assert.equal(associationStatus(c,id),expected,'citta='+c+',factor='+id);
  assert.equal(inspectOccasionalFactor(c,id).placement,expected);
  checked++;
 }
 assert.equal(checked,1331);assert.equal(verifyOccasionalMatrix(),true);
});
test('an optional factor is UNKNOWN in reality, not asserted to have arisen',()=>{
 for(const [c,id] of [[3,20],[9,22],[10,24],[4,25],[31,47],[31,50],[47,51],[55,50]]){
  const a=inspectOccasionalFactor(c,id);
  assert.equal(a.placement,'optional');assert.equal(a.occurrence,'UNKNOWN');
 }
});
test('mana excludes diṭṭhi-associated greed; issa macchariya kukkucca never co-arise',()=>{
 assert.equal(inspectOccasionalFactor(1,20).placement,'forbidden');
 assert.equal(inspectOccasionalFactor(3,20).placement,'optional');
 assert.throws(()=>validateOccasionalExample(9,[22,23]),/Mutually exclusive/);
});
test('thina-middha jointly optional in precisely five prompted unwholesome cittas',()=>{
 assert.deepEqual([2,4,6,8,10].map(x=>inspectOccasionalFactor(x,25).placement),Array(5).fill('optional'));
 assert.throws(()=>validateOccasionalExample(10,[25]),/co-arise/);
 assert.deepEqual(validateOccasionalExample(10,[25,26]).optionalIds,[25,26]);
});
test('three virati separate in mundane kusala, required together in lokuttara',()=>{
 assert.throws(()=>validateOccasionalExample(31,[47,48]),/Mutually exclusive/);
 for(let c=82;c<=121;c++)assert.deepEqual(inspectOccasionalCitta(c).mandatory.map(x=>x.factorId),[47,48,49]);
 assert.equal(inspectOccasionalFactor(39,47).placement,'forbidden');
});
test('karuna/mudita alternatives, exclusions and disputed equanimity view',()=>{
 assert.throws(()=>validateOccasionalExample(31,[50,51]),/Mutually exclusive/);
 for(const c of [59,64,69,70,82])assert.equal(inspectOccasionalFactor(c,50).placement,'forbidden');
 assert.equal(inspectOccasionalFactor(35,50).traditionDispute,true);
 assert.equal(inspectOccasionalFactor(31,50).traditionDispute,false);
});
test('selected example cannot be treated as observed citta or conclusive cross-group relation',()=>{
 const s=validateOccasionalExample(31,[47]);
 assert.equal(s.epistemicStatus,'ILLUSTRATIVE_ONLY');assert.equal(s.exactObservedCittaId,null);
 assert.throws(()=>validateOccasionalExample(31,[20]),/cannot optionally include/);
 assert.throws(()=>validateOccasionalExample(31,[8]),/non-occasional/);
 assert.match(validateOccasionalExample(31,[47,50]).furtherReview,/UNVERIFIED_JOINT_CONTEXT/);
});
test('aggregate 89 rows are not concrete moment instantiations',()=>{
 const a=inspectOccasionalCitta(82,{scheme:89});
 assert.equal(a.aggregate,true);assert.ok(a.factors.every(x=>x.occurrence==='UNKNOWN_AGGREGATE'));
 assert.throws(()=>documentedPlacement(122,47),/Expected a concrete citta/);
});
test('eleven records partition on all 121 cittas',()=>{
 for(let c=1;c<=121;c++){const d=inspectOccasionalCitta(c);
  assert.equal(d.factors.length,11);
  assert.equal(d.mandatory.length+d.optional.length+d.forbidden.length,11);
 }
});
