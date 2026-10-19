import test from 'node:test';
import assert from 'node:assert/strict';
import {assessRupaNama,validateRupaNamaAssessment,FIVE_SENSE_RELATIONS} from '../src/rupa-nama.js';

const prior=id=>({rupaId:id,present:true,timing:'prior-present'});
// Independent witness fixtures from Paṭṭhāna §20 and Arisen Triplet.
const ten=[[13,5,10],[14,6,11],[15,7,12],[16,8,13],[17,9,1],
 [20,5,10],[21,6,11],[22,7,12],[23,8,13],[24,9,3]];

test('§20 adds exactly one prenascence dissociation *base* role for ten sense cittas',()=>{
 assert.deepEqual(FIVE_SENSE_RELATIONS.find(x=>x.id==='vippayutta').roles,['base']);
 assert.equal(FIVE_SENSE_RELATIONS.length,7);
 assert.equal(FIVE_SENSE_RELATIONS.reduce((n,x)=>n+x.roles.length,0),10);
 for(const [citta,base,object] of ten){
  const a=assessRupaNama(citta,{base:prior(base),object:prior(object)});
  const e=a.evidence.filter(x=>x.conditionId==='vippayutta');
  assert.equal(e.length,1);
  assert.deepEqual([e[0].conditionNumber,e[0].role,e[0].rupaId,e[0].subtype],
   [20,'base',base,'purejata-vippayutta']);
  assert.equal(e[0].source.locator,'Paccayaniddesa §20');
  assert.match(e[0].source.appliedCase,/patthana1\.18/);
  assert.equal(e[0].status,'CONDITIONAL_ON_SCENARIO');
  assert.ok(!a.unknownConditions.includes('vippayutta'));
  assert.equal(validateRupaNamaAssessment(a),true);
 }
});
test('object-only input never becomes vippayutta as physical base',()=>{
 const a=assessRupaNama(13,{base:{},object:prior(10)});
 assert.equal(a.evidence.find(x=>x.conditionId==='arammana').status,'CONDITIONAL_ON_SCENARIO');
 assert.equal(a.evidence.find(x=>x.conditionId==='vippayutta').status,'UNKNOWN');
 assert.equal(a.evidence.filter(x=>x.conditionId==='vippayutta'&&x.role==='object').length,0);
});
test('wrong, newly-arisen, dissolving, ceased and absent sense bases do not qualify',()=>{
 for(const [citta,base,object] of ten){
  for(const timing of ['newly-arisen','dissolving','ceased']){
   const b={rupaId:base,present:timing!=='ceased',timing};
   const a=assessRupaNama(citta,{base:b,object:prior(object)});
   assert.equal(a.evidence.find(x=>x.conditionId==='vippayutta').status,'BLOCKED_IN_DECLARED_SCENARIO');
  }
  const absent=assessRupaNama(citta,{base:{rupaId:base,present:false,timing:'unknown'},object:prior(object)});
  assert.equal(absent.evidence.find(x=>x.conditionId==='vippayutta').status,'BLOCKED_IN_DECLARED_SCENARIO');
 }
 assert.throws(()=>assessRupaNama(13,{base:prior(6)}),/incompatible/);
});
test('missing data remains UNKNOWN, other cittas NOT_EVALUATED, forged proof rejected',()=>{
 const r=assessRupaNama(13,{base:{rupaId:5,present:true,timing:'unknown'},object:prior(10)});
 assert.equal(r.evidence.find(x=>x.conditionId==='vippayutta').status,'UNKNOWN');
 for(const id of [1,18,29,31,55,82,121])assert.equal(assessRupaNama(id).status,'NOT_EVALUATED');
 const original=assessRupaNama(13,{base:prior(5),object:prior(10)});
 for(const edit of [
   x=>{x.evidence.find(e=>e.conditionId==='vippayutta').source.locator='invented';},
   x=>{x.evidence.find(e=>e.conditionId==='vippayutta').role='object';},
   x=>{x.evidence.splice(x.evidence.findIndex(e=>e.conditionId==='vippayutta'),1);},
   x=>{x.evidence.find(e=>e.conditionId==='vippayutta').status='CONFIRMED';}
 ]){
  const copy=JSON.parse(JSON.stringify(original));edit(copy);
  assert.throws(()=>validateRupaNamaAssessment(copy));
 }
});
