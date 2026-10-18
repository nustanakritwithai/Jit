import test from 'node:test';
import assert from 'node:assert/strict';
import {FACTORS,JAVANAS,DOORS} from '../src/data.js';
import {createProcess,validateProcess,javanaType,validateAssociations} from '../src/engine.js';
import {getSampayoga} from '../src/association.js';

test('full five-door case contains 17 moments; canonical citta IDs at every stage',()=>{
 const p=createProcess();
 assert.deepEqual(p.moments.map(m=>m.stage),['past','vibrate','arrest','five_advert','sense','receive','investigate','determine',...Array(7).fill('javana'),'register','register']);
 assert.deepEqual([p.moments[3].cittaId,p.moments[4].cittaId,p.moments[5].cittaId,p.moments[6].cittaId,p.moments[7].cittaId,p.moments[8].cittaId],[28,20,25,27,29,31]);
 assert.equal(p.moments[4].activeCount,7);
 assert.equal(p.moments[7].activeCount,11);
 assert.equal(p.moments[8].activeCount,33);
 assert.equal(validateProcess(p),true);
});

test('mind-door representation = 12 or 10 demonstrated moments',()=>{
 const m=createProcess({door:'mind'});
 assert.equal(m.moments.length,12);
 assert.deepEqual(m.moments.map(x=>x.stage),['vibrate','arrest','mind_advert',...Array(7).fill('javana'),'register','register']);
 assert.equal(createProcess({door:'mind',mindClarity:'obscure'}).moments.length,10);
});

test('all six doors and 16 javana presets are realizable with correct 52-slot vectors',()=>{
 for(const j of JAVANAS)for(const d of DOORS){
  const p=createProcess({door:d.id,javana:j.id});
  assert.equal(validateProcess(p),true);
  for(const moment of p.moments){
   assert.equal(Object.keys(moment.vector).length,52);
   assert.equal(moment.activeCount,getSampayoga(moment.cittaId).mandatory.length+moment.chosenExtras.length);
   for(let id=1;id<=7;id++)assert.equal(moment.vector[id],true);
  }
 }
 assert.equal(FACTORS.length,52);
});

test('four sense intensities choose javanā and registration conditionally',()=>{
 for(const [g,j,r] of [['very-great',7,2],['great',7,0],['slight',0,0],['very-slight',0,0]]){
  const p=createProcess({intensity:g});
  assert.equal(p.moments.filter(m=>m.stage==='javana').length,j);
  assert.equal(p.moments.filter(m=>m.stage==='register').length,r);
 }
});

test('two processes allow distinct ethical javanas, not simultaneous opposite factors',()=>{
 const p=createProcess({door:'body',followMind:true,interludeCount:3,javana:'dosa',nextJavana:'kusala_wisdom'});
 assert.deepEqual(p.cycles.map(c=>c.id),[1,2]);
 assert.equal(p.moments.filter(m=>m.stage==='return').length,3);
 assert.equal(p.moments.filter(m=>m.stage==='javana').length,14);
 assert.equal(p.moments.filter(m=>m.stage==='javana'&&m.cycle===1).every(m=>m.cittaId===9),true);
 assert.equal(p.moments.filter(m=>m.stage==='javana'&&m.cycle===2).every(m=>m.cittaId===31),true);
 assert.equal(validateProcess(p),true);
});

test('preset map respects optional mutually exclusive factors and fixed components',()=>{
 for(const p of JAVANAS){const r=javanaType(p.id);assert.equal(validateAssociations(r),true);}
 assert.equal(javanaType('dosa').ids.includes(12),false);
 assert.equal(javanaType('moha_doubt').ids.includes(10),false);
 assert.equal(javanaType('moha_restless').ids.includes(10),true);
 assert.ok(javanaType('lobha_sloth').ids.includes(25));
 assert.throws(()=>createProcess({javana:'nonexistent'}),/Unknown javana/);
 assert.throws(()=>createProcess({interludeCount:0}),/Interlude/);
});

test('validation catches illicit matrix selection and conflicting factors',()=>{
 assert.throws(()=>validateAssociations({cittaId:9,family:'akusala',ids:[1,2,3,4,5,6,7,14,15,16,17,18,21]}),/Incompatible/);
 assert.throws(()=>validateAssociations({family:'kusala',ids:[1,2,3,4,5,6,7,28]}),/common nineteen/);
 assert.throws(()=>validateAssociations({family:'akusala',ids:[1,2,3,4,5,6,7,14,15,16,17,18,25]}),/co-arise/);
});

test('no shared mutable active vectors between separate moments',()=>{
 const p=createProcess(),a=p.moments[8],b=p.moments[9];
 assert.notEqual(a.vector,b.vector);
 a.vector['1']=false;
 assert.equal(b.vector['1'],true);
 assert.equal(b.activeCount,33);
});