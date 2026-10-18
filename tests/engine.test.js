import test from 'node:test';
import assert from 'node:assert/strict';
import {FACTORS, GROUPS, JAVANAS, DOORS} from '../src/data.js';
import {createProcess, javanaType, validateAssociations,validateProcess,TYPE_RULES} from '../src/engine.js';

test('52 unique canonical factors, counts 7 + 6 + 14 + 25',()=>{
 assert.equal(FACTORS.length,52);assert.equal(new Set(FACTORS.map(x=>x.id)).size,52);
 assert.deepEqual(GROUPS.map(g=>FACTORS.filter(f=>f.group===g.id).length),[7,6,14,25]);
});
test('all 52 can be activated in some educational preset across the workflow',()=>{
 const union=new Set(Object.values(TYPE_RULES).flatMap(v=>v.ids));
 for(const p of JAVANAS)for(const id of javanaType(p.id).ids)union.add(id);
 assert.deepEqual([...union].sort((a,b)=>a-b),FACTORS.map(f=>f.id));
});
test('five-door very-great exactly 17 moments, 7 javana, 2 registrations',()=>{
 const m=createProcess();assert.equal(m.moments.length,17);
 assert.deepEqual(m.moments.map(x=>x.stage),['past','vibrate','arrest','five_advert','sense','receive','investigate','determine',...Array(7).fill('javana'),'register','register']);
 assert.equal(m.moments[4].activeCount,7);assert.equal(m.moments[7].activeCount,11);assert.equal(m.moments[8].activeCount,33);
 assert.equal(validateProcess(m),true);
});
test('different grades control the possibility of javana and registration',()=>{
 for(const [intensity,javana,register] of [['very-great',7,2],['great',7,0],['slight',0,0],['very-slight',0,0]]){
  const m=createProcess({intensity});assert.equal(m.moments.filter(x=>x.stage==='javana').length,javana);
  assert.equal(m.moments.filter(x=>x.stage==='register').length,register);
  assert.equal(validateProcess(m),true);
 }
});
test('all doors support model and mind process has different staging',()=>{
 for(const d of DOORS){const p=createProcess({door:d.id});assert.equal(validateProcess(p),true);}
 const m=createProcess({door:'mind',mindClarity:'clear'});
 assert.deepEqual(m.moments.map(x=>x.stage),['vibrate','arrest','mind_advert',...Array(7).fill('javana'),'register','register']);
 assert.equal(createProcess({door:'mind',mindClarity:'obscure'}).moments.length,10);
});
test('sense-to-mind continuity has bounded distinct cycles, one explicit bridge',()=>{
 const p=createProcess({door:'ear',followMind:true});assert.equal(p.cycles.length,2);
 assert.equal(p.moments.filter(x=>x.stage==='return').length,1);
 assert.equal(p.moments.filter(x=>x.stage==='javana').length,14);
 assert.equal(validateProcess(p),true);
});
test('every scenario builds 52 boolean variables for every moment and preserves 7 universal factors',()=>{
 for(const j of JAVANAS){for(const door of DOORS){const p=createProcess({door:door.id,javana:j.id});
  for(const m of p.moments){assert.equal(Object.keys(m.vector).length,52);for(let id=1;id<=7;id++)assert.equal(m.vector[id],true);}
  assert.equal(validateProcess(p),true);
 }}
});
test('rules disallow incompatible mental factors',()=>{
 assert.throws(()=>validateAssociations({family:'akusala',ids:[1,2,3,4,5,6,7,14,15,16,17,18,21]}),/Incompatible/);
 assert.throws(()=>validateAssociations({family:'kusala',ids:[1,2,3,4,5,6,7,28]}),/common nineteen/);
 assert.throws(()=>validateAssociations({family:'akusala',ids:[1,2,3,4,5,6,7,14,15,16,17,18,25]}),/co-arise/);
 assert.throws(()=>createProcess({javana:'unknown'}),/Unknown javana/);
});
test('independent moments do not share mutable vector objects',()=>{
 const p=createProcess(),a=p.moments[8],b=p.moments[9];assert.notEqual(a.vector,b.vector);
 a.vector[14]=false;assert.equal(b.vector[14],false);assert.equal(b.activeCount,33);
});
