import test from 'node:test';
import assert from 'node:assert/strict';
import {createProcess,validateProcess} from '../src/engine.js';
import {resolveSampayoga} from '../src/association.js';
import {PACCAYA_24, PATTHANA_CANONICAL, inferWithinMoment,
 qualifiesAsRepetition, explainConditions,validateConditionality} from '../src/conditions.js';

/**
 * These fixtures are INDEPENDENT observations drawn from the named canonical
 * passages; tests should never just regenerate the expected values from code.
 * Paṭṭhāna Paccayaniddesa §§6,7,8,12,13,14,15,16,17,19,21,24;
 * Gorkom, The Conditionality of Life chapters 11, 13–17.
 */
const PALI='https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html';
const f=(id)=>{
 const r=resolveSampayoga(id);
 return {...r,cittaId:id,family:r.citta.quality,active:r.active,objectId:'teaching-object'};
};

const EVIDENCE_FIXTURES=[
 {citta:13,short:'seeing unwholesome vipāka',must:['ahara','indriya','vipaka','nissaya','atthi','avigata'],exclude:['hetu','jhana']},
 {citta:20,short:'seeing wholesome vipāka',must:['ahara','indriya','vipaka','nissaya','atthi','avigata'],exclude:['hetu','jhana']},
 {citta:17,short:'body unwholesome vipāka',must:['ahara','indriya','vipaka'],exclude:['hetu','jhana']},
 {citta:24,short:'body wholesome vipāka',must:['ahara','indriya','vipaka'],exclude:['hetu','jhana']},
 {citta:18,short:'receiving unwholesome vipāka',must:['ahara','indriya','vipaka','jhana'],exclude:['hetu']},
 {citta:9,short:'dosa-mūla',must:['hetu','ahara','indriya','jhana'],exclude:['vipaka']},
 {citta:11,short:'moha doubt',must:['hetu','ahara','indriya','jhana'],exclude:['vipaka']},
 {citta:31,short:'beautiful sense-sphere kusala',must:['hetu','ahara','indriya','jhana','atthi'],exclude:['vipaka']},
 {citta:43,short:'sense-sphere resultant bhavaṅga example',must:['hetu','vipaka','ahara'],exclude:[]},
 {citta:55,short:'first rūpāvacara kusala jhāna',must:['hetu','ahara','indriya','jhana'],exclude:['vipaka']}
];

test('all 24 canonically ordered paccaya, individually indexed sources, and explicit unknowns',()=>{
 assert.deepEqual(PACCAYA_24.map(p=>p.id),[
  'hetu','arammana','adhipati','anantara','samanantara','sahajata',
  'annamanna','nissaya','upanissaya','purejata','pacchajata','asevana',
  'kamma','vipaka','ahara','indriya','jhana','magga','sampayutta','vippayutta',
  'atthi','natthi','vigata','avigata']);
 assert.equal(PATTHANA_CANONICAL.pali,PALI);
 assert.equal(PACCAYA_24.filter(p=>p.mode==='illustrated').length,18);
 assert.deepEqual(PACCAYA_24.filter(p=>p.mode==='reference-only').map(p=>p.id),
  ['adhipati','upanissaya','purejata','pacchajata','magga','vippayutta']);
 for(const [i,p] of PACCAYA_24.entries()){
  assert.equal(p.number,i+1);
  assert.equal(p.source.pali,PALI);
  assert.equal(p.source.locator,`Paccayaniddesa §${i+1}`);
  assert.ok(p.limits.includes(p.mode==='reference-only'?'UNKNOWN':'เฉพาะ'));
 }
});

test('independent source-linked citta fixtures test BOTH applicable and excluded conditions',()=>{
 for(const item of EVIDENCE_FIXTURES){
  const status=new Set(inferWithinMoment(f(item.citta)).conditions);
  for(const id of item.must)assert.equal(status.has(id),true,`${item.short} requires ${id}`);
  for(const id of item.exclude)assert.equal(status.has(id),false,`${item.short} must not claim ${id}`);
 }
});

test('no jhāna-condition on any of ten sense consciousnesses; not an attainment detector',()=>{
 for(const id of [13,14,15,16,17,20,21,22,23,24]){
  const sample=inferWithinMoment(f(id));
  assert.equal(sample.isFiveSense,true);
  assert.ok(!sample.conditions.includes('jhana'),`sense-citta ${id}`);
 }
 assert.ok(inferWithinMoment(f(31)).conditions.includes('jhana'));
 assert.ok(inferWithinMoment(f(55)).conditions.includes('jhana'));
 const dosa=inferWithinMoment(f(9));
 assert.equal(dosa.details.find(p=>p.id==='jhana').support.cetasikaIds.includes(2),false,
  'domanassa is not counted as positive sukha/upekkhā jhāna factor');
});

test('real entities: mental āhāra is phassa(1), cetanā(4), plus citta itself, not an invented cetasika',()=>{
 for(const id of [13,31,55]){
  const a=inferWithinMoment(f(id)).details.find(p=>p.id==='ahara');
  assert.deepEqual(a.support.cetasikaIds,[1,4]);
  assert.equal(a.support.includesCitta,true);
  assert.equal(a.source.locator,'Paccayaniddesa §15');
  const ind=inferWithinMoment(f(id)).details.find(p=>p.id==='indriya');
  assert.equal(ind.support.includesCitta,true);
  assert.ok(ind.support.cetasikaIds.includes(6),'mental life faculty exists for all consciousnesses');
 }
});

test('do not convert unmodelled rūpa, dominance, accumulations, and path into asserted FACT',()=>{
 for(const id of [13,31,55]){
  const conditions=inferWithinMoment(f(id)).conditions;
  for(const unsupported of ['adhipati','upanissaya','purejata','pacchajata','magga','vippayutta'])
   assert.equal(conditions.includes(unsupported),false,`${id} ${unsupported} is not evaluated`);
 }
 const p=createProcess();
 const info=explainConditions(p.conditions,4);
 assert.ok(info.unknowns.some(x=>x.id==='purejata'));
 assert.ok(info.moment.conditionStatus.some(x=>x.id==='jhana'&&x.status==='not-applicable-for-this-citta'));
});

test('canonical appanā case: final gotrabhū is āsevana to the ONE first-jhāna citta',()=>{
 for(const faculties of ['average','keen']){
  const p=createProcess({door:'mind',processMode:'appana-first',faculties});
  const gotraIndex=p.moments.findIndex(m=>m.stage==='change_lineage');
  const e=p.conditions.edges[gotraIndex];
  assert.equal(p.moments[gotraIndex+1].stage,'absorption');
  assert.equal(p.moments[gotraIndex].cittaId,31);
  assert.equal(p.moments[gotraIndex+1].cittaId,55);
  assert.ok(e.relations.includes('asevana'));
  assert.equal(p.conditions.counts.repetition,faculties==='average'?4:3);
  assert.equal(p.conditions.edges[gotraIndex+1].relations.includes('asevana'),false,
   'jhāna to subsequent bhavaṅga does not produce repetition');
  assert.ok(!p.conditions.edges.find(x=>x.relations.includes('asevana')&&x.crossCycle));
  assert.equal(validateProcess(p),true);
 }
});

test('counterfactual invalid āsevana edge rejected even if a citta otherwise validates',()=>{
 const normal=createProcess();
 const bad=normal.conditions.edges.find(e=>!e.relations.includes('asevana'));
 bad.relations.push('asevana');
 assert.throws(()=>validateConditionality(normal),/Invalid \/ missing āsevana/);
 const appana=createProcess({door:'mind',processMode:'appana-first'});
 const gotra=appana.moments.findIndex(m=>m.stage==='change_lineage');
 appana.conditions.edges[gotra].relations=appana.conditions.edges[gotra].relations.filter(x=>x!=='asevana');
 assert.throws(()=>validateConditionality(appana),/Invalid \/ missing āsevana/);
});

test('each canonical 121 citta has mentally instantiated factors that resolve to cited paccaya rules',()=>{
 for(let id=1;id<=121;id++){
  const row=inferWithinMoment(f(id));
  assert.ok(row.conditions.includes('ahara'));
  assert.ok(row.conditions.includes('indriya'));
  assert.ok(row.conditions.includes('nissaya'));
  assert.ok(row.conditions.includes('atthi'));
  assert.ok(row.conditions.includes('avigata'));
  assert.equal(row.conditions.includes('jhana'),![13,14,15,16,17,20,21,22,23,24].includes(id),`jhāna ${id}`);
  for(const proof of row.details){
   assert.equal(proof.source.pali,PALI);
   assert.ok(proof.source.locator.startsWith('Paccayaniddesa'));
   assert.notEqual(proof.basis,'scenario-assumption');
  }
 }
});

test('tampering with declared supporting factors fails closed, not a fake scholarly PASS',()=>{
 const p=createProcess({door:'eye'});
 const ahara=p.conditions.inMoments[4].proofs.find(x=>x.id==='ahara');
 ahara.support.cetasikaIds.push(52);
 assert.throws(()=>validateConditionality(p),/Missing or tampered proof/);
});
