import test from 'node:test';
import assert from 'node:assert/strict';
import {PACCAYA_24,buildConditionality,explainConditions,validateConditionality} from '../src/conditions.js';
import {createProcess} from '../src/engine.js';

test('24 conditions registry is complete, but labels partial modeling explicitly',()=>{
 assert.equal(PACCAYA_24.length,24);
 assert.equal(new Set(PACCAYA_24.map(p=>p.id)).size,24);
 assert.ok(PACCAYA_24.some(p=>p.mode==='reference-only'));
 assert.equal(PACCAYA_24.find(p=>p.id==='asevana').mode,'illustrated');
});

test('17-moment full five-door: 16 adjacency edges, 6 repetition edges, no skipped moments',()=>{
 const p=createProcess();
 assert.equal(p.moments.length,17);
 assert.equal(p.conditions.edges.length,16);
 assert.equal(p.conditions.counts.repetition,6);
 assert.equal(p.conditions.cycleTransitions.length,0);
 assert.equal(validateConditionality(p),true);
 assert.equal(p.conditions.edges.at(-1).relations.includes('asevana'),false);
 assert.equal(p.conditions.edges.filter(e=>e.relations.includes('asevana')).every(e=>e.fromCycle===e.toCycle),true);
});

test('between processes: explicit bhavangas, 12 repetition edges; never jump directly over bhavangas',()=>{
 const p=createProcess({door:'ear',javana:'dosa',followMind:true,interludeCount:4,nextJavana:'kusala_wisdom'});
 assert.equal(p.cycles.length,2);
 assert.equal(p.moments.filter(m=>m.stage==='return').length,4);
 assert.equal(p.conditions.counts.repetition,12);
 assert.equal(p.conditions.cycleTransitions[0].bhavangaCount,4);
 assert.notEqual(p.conditions.cycleTransitions[0].fromObjectId,p.conditions.cycleTransitions[0].toObjectId);
 assert.ok(p.moments.slice(p.cycles[1].start,p.cycles[1].end+1).filter(m=>m.stage==='javana').every(m=>m.cittaId===31));
 assert.equal(validateConditionality(p),true);
 const a=p.moments.findIndex(m=>m.stage==='return');
 assert.equal(p.conditions.edges[a-1].toIndex,a);
 assert.equal(p.conditions.edges[a].fromIndex,a);
 assert.equal(p.conditions.edges.some(e=>e.relations.includes('asevana')&&e.crossCycle),false);
});

test('chosen mental-factors and roots explain within-moment hetu, association and result',()=>{
 const p=createProcess({javana:'dosa_envy'});
 const javana=p.moments.findIndex(m=>m.stage==='javana');
 const detail=explainConditions(p.conditions,javana);
 assert.ok(detail.moment.conditions.includes('hetu'));
 assert.ok(detail.moment.conditions.includes('sampayutta'));
 assert.ok(detail.moment.roots.includes(14));
 assert.ok(detail.moment.roots.includes(21));
 assert.equal(detail.incoming.relations.includes('asevana'),false);
 assert.equal(explainConditions(p.conditions,javana+1).incoming.relations.includes('asevana'),true);
 assert.ok(p.conditions.inMoments.some(x=>x.conditions.includes('vipaka')));
 assert.throws(()=>explainConditions(p.conditions,999),/Unknown moment/);
});

test('invalid paccaya adjacency is rejected even if all citta rows were valid',()=>{
 const p=createProcess();
 p.conditions.edges[3].toIndex=8;
 assert.throws(()=>validateConditionality(p),/Adjacency/);
});