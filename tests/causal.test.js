import test from 'node:test';
import assert from 'node:assert/strict';
import {createProcess,validateProcess} from '../src/engine.js';
import {planVithi,planAppana,chooseResultant,chooseJavana,assessJavanaPremises,validateCausalInputs,CAUSAL_SOURCES} from '../src/causal.js';
import {PACCAYA_24} from '../src/conditions.js';
const config=()=>({...createProcess().config});

test('causal engine derives 17 canonical sense-door moments from transitions',()=>{
 const expected=['past','vibrate','arrest','five_advert','sense','receive','investigate','determine',...Array(7).fill('javana'),'register','register'];
 const path=planVithi(config(),'five-door');
 assert.deepEqual(path.map(e=>e.stage),expected);
 for(const [i,e] of path.entries())assert.equal(e.next,path[i+1]?.stage??null);
 assert.ok(path.every(x=>x.transition?.source?.url));
});

test('causal planner respects four degrees and both mind-door clarity scenarios',()=>{
 const cases=[['very-great',17,7,2],['great',16,7,0],['slight',15,0,0],['very-slight',17,0,0]];
 for(const [intensity,n,j,r] of cases){
  const p=createProcess({intensity});
  assert.equal(p.moments.length,n);
  assert.equal(p.moments.filter(x=>x.stage==='javana').length,j);
  assert.equal(p.moments.filter(x=>x.stage==='register').length,r);
  assert.equal(validateProcess(p),true);
 }
 for(const [clarity,n,r] of [['clear',12,2],['obscure',10,0]]){
  const p=createProcess({door:'mind',mindClarity:clarity});
  assert.equal(p.moments.length,n);assert.equal(p.moments.filter(x=>x.stage==='register').length,r);
 }
});

test('selected resultant citta changes by entered hypothetical object quality and door',()=>{
 const eyeBad=createProcess({door:'eye',objectQuality:'undesirable'});
 assert.deepEqual(['sense','receive','investigate','register'].map(k=>eyeBad.moments.find(m=>m.stage===k).cittaId),[13,18,19,19]);
 const bodyGood=createProcess({door:'body',objectQuality:'very-desirable'});
 assert.deepEqual(['sense','receive','investigate','register'].map(k=>bodyGood.moments.find(m=>m.stage===k).cittaId),[24,25,26,26]);
 const neutral=createProcess({door:'ear',objectQuality:'desirable'});
 assert.deepEqual(['sense','receive','investigate','register'].map(k=>neutral.moments.find(m=>m.stage===k).cittaId),[21,25,27,27]);
 assert.equal(bodyGood.moments.find(m=>m.stage==='register').ruleAudit.selection.basis,'scenario-assumption');
 assert.equal(bodyGood.moments.find(m=>m.stage==='sense').ruleAudit.selection.basis,'commentarial-pattern');
});

test('guided attention cannot select an exact javana: UNKNOWN, explicit preset only',()=>{
 for(const attention of ['wise','unwise'])for(const cue of ['attraction','aversion','doubt']){
  const p=createProcess({door:'ear',selectionMode:'guided',attention,reactionCue:cue,javana:'dosa'});
  const javana=p.moments.filter(m=>m.stage==='javana');
  assert.equal(javana.length,7);
  assert.ok(javana.every(m=>m.cittaId===9)); // explicit illustrative preset; NEVER inferred from cue
  for(const m of javana){
   const s=m.ruleAudit.selection;
   assert.equal(s.epistemicStatus,'UNKNOWN');
   assert.equal(s.inference.exactCittaId,null);
   assert.equal(s.chosenBy,'user-example-preset');
   assert.equal(s.basis,'scenario-assumption');
   assert.equal(s.rule,'javana-unresolved-example-only');
   assert.ok(s.reason.includes('UNKNOWN'));
  }
  assert.equal(assessJavanaPremises(p.config).status,'UNKNOWN');
 }
 const manual=createProcess({selectionMode:'manual',attention:'unwise',javana:'lobha_view'});
 assert.equal(manual.moments.find(x=>x.stage==='javana').cittaId,1);
 assert.equal(manual.moments.find(x=>x.stage==='javana').ruleAudit.selection.epistemicStatus,'NOT_INFERRED');
});

test('two vithis allow separately declared examples while inference stays UNKNOWN',()=>{
 const p=createProcess({door:'ear',followMind:true,interludeCount:3,selectionMode:'guided',
  attention:'unwise',reactionCue:'aversion',nextAttention:'wise',nextReactionCue:'doubt',
  javana:'dosa',nextJavana:'kusala_wisdom'});
 const js=p.moments.filter(m=>m.stage==='javana');
 assert.equal(js.length,14);
 assert.ok(js.filter(m=>m.cycle===1).every(x=>x.cittaId===9));
 assert.ok(js.filter(m=>m.cycle===2).every(x=>x.cittaId===31));
 assert.ok(js.every(x=>x.ruleAudit.selection.inference.status==='UNKNOWN'));
 assert.equal(p.moments.filter(m=>m.stage==='return').length,3);
 assert.equal(p.conditions.counts.repetition,12);
 assert.ok(p.conditions.edges.every(e=>e.toIndex===e.fromIndex+1));
 assert.ok(p.conditions.edges.filter(e=>e.crossCycle).every(e=>!e.relations.includes('asevana')));
 assert.equal(p.transitionRules.length,p.moments.length);
});

test('register is UNKNOWN example, sense/receive/investigate conditional on entered object quality',()=>{
 const p=createProcess({objectQuality:'very-desirable'});
 for(const name of ['sense','receive','investigate']){
  assert.equal(p.moments.find(m=>m.stage===name).ruleAudit.selection.epistemicStatus,'CONDITIONAL_ON_SCENARIO');
 }
 const register=p.moments.find(m=>m.stage==='register');
 assert.equal(register.ruleAudit.selection.epistemicStatus,'UNKNOWN');
 assert.equal(register.ruleAudit.selection.basis,'scenario-assumption');
 assert.match(register.ruleAudit.selection.reason,/UNKNOWN/);
 assert.throws(()=>{register.ruleAudit.selection.basis='commentarial-pattern';validateProcess(p);},/Registration cannot be inferred/);
});

test('tampered causal audit cannot convert an UNKNOWN guided example into scriptural FACT',()=>{
 const p=createProcess({selectionMode:'guided',attention:'wise',reactionCue:'attraction',javana:'moha_doubt'});
 const j=p.moments.find(m=>m.stage==='javana');
 j.ruleAudit.selection.epistemicStatus='CONFIRMED';
 assert.throws(()=>validateProcess(p),/Javana inference must remain UNKNOWN|Epistemic status mismatch/);
 const q=createProcess({selectionMode:'guided',javana:'dosa'});
 const audit=q.moments.find(m=>m.stage==='javana').ruleAudit.selection;
 audit.inference={...audit.inference,exactCittaId:9};
 assert.throws(()=>validateProcess(q),/Javana inference must remain UNKNOWN|Epistemic status mismatch/);
});

test('first-appana scenario: exactly one first-rupa-jhana moment after 3 or 4 preparation javanas',()=>{
 const average=createProcess({door:'mind',processMode:'appana-first',faculties:'average'});
 const keen=createProcess({door:'mind',processMode:'appana-first',faculties:'keen'});
 assert.deepEqual(average.moments.map(m=>m.stage),['vibrate','arrest','mind_advert','preparation','access','conformity','change_lineage','absorption','return']);
 assert.deepEqual(keen.moments.map(m=>m.stage),['vibrate','arrest','mind_advert','access','conformity','change_lineage','absorption','return']);
 for(const p of [average,keen]){
  assert.equal(p.cycles[0].kind,'appana-demo');
  const absorption=p.moments.filter(m=>m.stage==='absorption');
  assert.equal(absorption.length,1);assert.equal(absorption[0].cittaId,55);
  assert.equal(absorption[0].ruleAudit.selection.basis,'scenario-assumption');
  assert.equal(p.conditions.counts.repetition,p.config.faculties==='average'?4:3);
  assert.equal(p.moments.filter(m=>m.stage==='register').length,0);
  assert.ok(p.moments.slice(3,-2).every(m=>m.cittaId===31));
  assert.equal(validateProcess(p),true);
 }
 assert.throws(()=>createProcess({door:'eye',processMode:'appana-first'}),/mind door/);
});

test('24 paccaya have named coverage but not all are asserted as computable',()=>{
 const p=createProcess();
 assert.equal(PACCAYA_24.length,24);
 assert.equal(PACCAYA_24.filter(c=>c.mode==='illustrated').length,18);
 assert.equal(PACCAYA_24.filter(c=>c.mode==='reference-only').length,6);
 assert.equal(p.coverage.unknownConditions,6);
 assert.ok(p.coverage.unsupported.includes('full Paṭṭhāna 24-case solver'));
 assert.ok(CAUSAL_SOURCES.vithi.url && CAUSAL_SOURCES.scenario.url===null);
 assert.equal(p.conditions.inMoments[4].causalAudit.selection.rule,'resultant-sense');
});

test('invalid and underspecified causal parameters fail closed',()=>{
 assert.throws(()=>createProcess({objectQuality:'arbitrary'}),/object quality/);
 assert.throws(()=>createProcess({selectionMode:'predict-real-person'}),/Unknown javana decision mode/);
 assert.throws(()=>createProcess({processMode:'magga-phala'}),/Unknown process mode/);
 assert.throws(()=>createProcess({faculties:'clairvoyant'}),/Unknown faculty strength/);
 assert.throws(()=>createProcess({attention:'unknown'}),/Unknown attention condition/);
 assert.throws(()=>chooseResultant('sense','mind','desirable'),/five-door input/);
 assert.throws(()=>planAppana(config()),/Not an appanā case/);
});
