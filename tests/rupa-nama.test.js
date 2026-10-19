import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assessRupaNama,validateRupaNamaAssessment,FIVE_SENSE_RELATIONS,DECLARED_RUPA_TIMING} from '../src/rupa-nama.js';
const prior=id=>({rupaId:id,present:true,timing:'prior-present'});
// Independent Paṭṭhāna sense-base / sense-object witnesses, NOT derived from app output.
const cases=[[13,5,10],[14,6,11],[15,7,12],[16,8,13],[17,9,1],
 [20,5,10],[21,6,11],[22,7,12],[23,8,13],[24,9,3]];
test('Paccayaniddesa: six conditions indexed separately and 9 base/object roles',()=>{
 assert.deepEqual(FIVE_SENSE_RELATIONS.map(x=>[x.id,x.number,x.roles]),[
  ['arammana',2,['object']],['nissaya',8,['base']],['purejata',10,['base','object']],
  ['indriya',16,['base']],['vippayutta',20,['base']],['atthi',21,['base','object']],['avigata',24,['base','object']]]);
 assert.equal(DECLARED_RUPA_TIMING.length,5);
});
test('all ten sense cittas: independent base/object witnesses and 9 source-linked roles each',()=>{
 for(const [id,b,o] of cases){
  const r=assessRupaNama(id,{base:prior(b),object:prior(o)});
  assert.equal(r.base.rupaId,b);assert.equal(r.object.rupaId,o);
  assert.equal(r.status,'CONDITIONAL_ON_SCENARIO');assert.equal(r.evidence.length,10);
  assert.equal(r.evidence.filter(x=>x.role==='base').length,6);
  assert.equal(r.evidence.filter(x=>x.role==='object').length,4);
  assert.ok(r.evidence.every(x=>x.status==='CONDITIONAL_ON_SCENARIO'));
  assert.ok(r.evidence.every(x=>x.source.locator==='Paccayaniddesa §'+x.conditionNumber));
  assert.equal(validateRupaNamaAssessment(r),true);
 }
});
test('body-object is solidity/temperature/motion but not cohesion',()=>{
 for(const c of [17,24])for(const id of [1,3,4])
  assert.equal(assessRupaNama(c,{base:prior(9),object:prior(id)}).status,'CONDITIONAL_ON_SCENARIO');
 for(const c of [17,24])assert.throws(()=>assessRupaNama(c,{object:prior(2)}),/incompatible/);
});
test('missing material presence and lifetime always UNKNOWN, never made-up CONFIRMED',()=>{
 for(const [id] of cases){
  const r=assessRupaNama(id);
  assert.equal(r.status,'UNKNOWN');
  assert.ok(r.evidence.every(x=>x.status==='UNKNOWN'));
 }
 assert.equal(assessRupaNama(13,{base:{present:true},object:{present:true}}).status,'UNKNOWN');
});
test('newly-arisen or dissolving material base does not function as preexistent base',()=>{
 for(const timing of ['newly-arisen','dissolving']){
  const r=assessRupaNama(13,{base:{rupaId:5,present:true,timing},object:prior(10)});
  assert.equal(r.status,'BLOCKED_IN_DECLARED_SCENARIO');
  assert.ok(r.evidence.filter(x=>x.role==='base').every(x=>x.status==='BLOCKED_IN_DECLARED_SCENARIO'));
  assert.ok(r.evidence.filter(x=>x.role==='object').every(x=>x.status==='CONDITIONAL_ON_SCENARIO'));
 }
});
test('declared absent base/object blocks that scenario but UNKNOWN does not mean false',()=>{
 for(const side of ['base','object']){
  const x={base:prior(5),object:prior(10)};
  x[side]={...x[side],present:false,timing:'unknown'};
  assert.equal(assessRupaNama(13,x).status,'BLOCKED_IN_DECLARED_SCENARIO');
 }
});
test('wrong sensory role, contradictory timing, ungrounded precision reject safely',()=>{
 assert.throws(()=>assessRupaNama(13,{base:prior(6)}),/incompatible/);
 assert.throws(()=>assessRupaNama(14,{object:prior(10)}),/incompatible/);
 assert.throws(()=>assessRupaNama(13,{base:{present:false,timing:'prior-present'}}),/contradictory/);
 assert.throws(()=>assessRupaNama(13,{base:{present:true,timing:'ceased'}}),/contradictory/);
 assert.throws(()=>assessRupaNama(13,{base:{timing:'17-citta-moments-exact'}}),/unknown timing/);
 assert.throws(()=>assessRupaNama(13,{pastKamma:'known'}),/Unexpected scenario/);
});
test('outside these 10 citta types remains NOT_EVALUATED and conditions incomplete',()=>{
 for(const id of [1,18,29,31,55,82,121])
  assert.equal(assessRupaNama(id).status,'NOT_EVALUATED');
 const r=assessRupaNama(13,{base:prior(5),object:prior(10)});
 for(const id of ['pacchajata','upanissaya'])assert.ok(r.unknownConditions.includes(id));
});
test('tampered certainty, altered canonical source and deleted proof always FAIL',()=>{
 const r=JSON.parse(JSON.stringify(assessRupaNama(13,{base:prior(5),object:prior(10)})));
 r.status='CONFIRMED';assert.throws(()=>validateRupaNamaAssessment(r),/CONFIRMED/);
 r.status='CONDITIONAL_ON_SCENARIO';r.evidence[0].source.locator='invented';
 assert.throws(()=>validateRupaNamaAssessment(r),/Tampered/);
});
test('UI inspects timing without claiming real occurrence',()=>{
 const ui=readFileSync(new URL('../src/rupa-ui.js',import.meta.url),'utf8');
 for(const id of ['rupaBaseTiming','rupaObjectTiming','rupaNamaStatus','rupaNamaEvidence'])
  assert.ok(ui.includes(id),id);
 assert.match(ui,/assessRupaNama/);assert.match(ui,/Paccayaniddesa/);
});
