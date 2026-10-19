import test from 'node:test';
import assert from 'node:assert/strict';
import {createProcess,validateProcess} from '../src/engine.js';
import {planVithi,planAppana,chooseResultant,chooseJavana,validateCausalInputs,CAUSAL_SOURCES} from '../src/causal.js';
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

test('guided attention selects only one explicitly assumed example, not a karmic prediction',()=>{
 const wise=createProcess({door:'ear',selectionMode:'guided',attention:'wise',reactionCue:'aversion'});
 const unwise=createProcess({door:'ear',selectionMode:'guided',attention:'unwise',reactionCue:'aversion'});
 const j=m=>m.moments.find(x=>x.stage==='javana');
 assert.equal(j(wise).cittaId,31);
 assert.equal(j(unwise).cittaId,9);
 assert.equal(j(unwise).ruleAudit.selection.basis,'scenario-assumption');
 assert.ok(j(unwise).ruleAudit.selection.reason.includes('ไม่ใช่การทำนาย'));
 assert.equal(createProcess({selectionMode:'manual',attention:'unwise',javana:'dosa'}).moments.find(x=>x.stage==='javana').cittaId,9);
 for(const [cue,id] of [['attraction',1],['aversion',9],['doubt',11]])assert.equal(createProcess({selectionMode:'guided',attention:'unwise',reactionCue:cue}).moments.find(x=>x.stage==='javana').cittaId,id);
});

test('separate second mind-door cycle may have different conditions and cannot jump bhavanga',()=>{
 const p=createProcess({door:'ear',followMind:true,interludeCount:3,selectionMode:'guided',attention:'unwise',reactionCue:'aversion',nextAttention:'wise',nextReactionCue:'doubt'});
 const js=p.moments.filter(m=>m.stage==='javana');
 assert.equal(js.length,14);
 assert.ok(js.filter(m=>m.cycle===1).every(x=>x.cittaId===9));
 assert.ok(js.filter(m=>m.cycle===2).every(x=>x.cittaId===31));
 assert.equal(p.moments.filter(m=>m.stage==='return').length,3);
 assert.equal(p.conditions.counts.repetition,12);
 assert.ok(p.conditions.edges.every(e=>e.toIndex===e.fromIndex+1));
 assert.ok(p.conditions.edges.filter(e=>e.crossCycle).every(e=>!e.relations.includes('asevana')));
 assert.equal(p.transitionRules.length,p.moments.length);
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
