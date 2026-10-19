import test from 'node:test';
import assert from 'node:assert/strict';
import {RUPA_28,RUPA_ORIGINS,KALAPAS_21,AVINIBBHOGA_8,PHOTTHABBA_3} from '../src/rupa.js';

// Independent Chapter VI fixture: CMA §§5, 7, 14–15, 17–22.
const OCTAD=[1,2,3,4,10,12,13,18];
const sorted=a=>[...a].sort((x,y)=>x-y);
const union=(...arr)=>sorted(new Set(arr.flat()));
const ORIGINS={
 kamma:[1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19],
 citta:[1,2,3,4,10,11,12,13,18,19,20,21,22,23,24],
 utu:[1,2,3,4,10,11,12,13,18,19,22,23,24],
 ahara:[1,2,3,4,10,12,13,18,19,22,23,24]
};
const KALAPA=[
 ['eye-decad','kamma',[5,17]],['ear-decad','kamma',[6,17]],
 ['nose-decad','kamma',[7,17]],['tongue-decad','kamma',[8,17]],
 ['body-decad','kamma',[9,17]],['female-decad','kamma',[14,17]],
 ['male-decad','kamma',[15,17]],['heart-decad','kamma',[16,17]],
 ['life-nonad','kamma',[17]],
 ['mind-octad','citta',[]],['body-intimation-nonad','citta',[20]],
 ['speech-intimation-decad','citta',[11,21]],
 ['mind-lightness-undecad','citta',[22,23,24]],
 ['body-lightness-dodecad','citta',[20,22,23,24]],
 ['speech-lightness-tridecad','citta',[11,21,22,23,24]],
 ['temperature-octad','utu',[]],['temperature-sound-nonad','utu',[11]],
 ['temperature-lightness-undecad','utu',[22,23,24]],
 ['temperature-sound-lightness-dodecad','utu',[11,22,23,24]],
 ['nutriment-octad','ahara',[]],['nutriment-lightness-undecad','ahara',[22,23,24]]
];

test('Ch VI §5: independent 28 rupa grouping and 18+10 classification',()=>{
 const groups=[...Array(4).fill('element'),...Array(5).fill('sensitivity'),
 ...Array(4).fill('object'),...Array(2).fill('sex'),'heart','life','nutriment','space',
 ...Array(2).fill('intimation'),...Array(3).fill('mutability'),...Array(4).fill('characteristic')];
 assert.equal(RUPA_28.length,28);
 assert.deepEqual(RUPA_28.map(x=>x.group),groups);
 assert.deepEqual(RUPA_28.map(x=>x.kind),[...Array(18).fill('concrete'),...Array(10).fill('nonconcrete')]);
 assert.deepEqual(PHOTTHABBA_3,[1,3,4]);
 assert.deepEqual(sorted(AVINIBBHOGA_8),OCTAD);
});
test('Ch VI §15: complete independent samutthana lists 18/15/13/12',()=>{
 assert.equal(RUPA_ORIGINS.length,4);
 for(const x of RUPA_ORIGINS)assert.deepEqual(sorted(x.rupaIds),ORIGINS[x.id],x.id);
 assert.deepEqual(RUPA_ORIGINS.map(x=>x.count),[18,15,13,12]);
});
test('Ch VI §§17–20: 21 kalapa compared member by member, not just counts',()=>{
 assert.equal(KALAPAS_21.length,21);assert.equal(KALAPA.length,21);
 const m=new Map(KALAPAS_21.map(x=>[x.id,x]));
 for(const [id,origin,extras] of KALAPA){
  const x=m.get(id);assert.ok(x,id);
  assert.equal(x.origin,origin,id);
  assert.deepEqual(sorted(x.members),union(OCTAD,extras),id);
  assert.equal(x.count,8+extras.length,id);
 }
 const counts=Object.fromEntries(['kamma','citta','utu','ahara'].map(k=>[k,KALAPA.filter(x=>x[1]===k).length]));
 assert.deepEqual(counts,{kamma:9,citta:6,utu:4,ahara:2});
});
test('Ch VI §21: only two temperature-born material groups also external',()=>{
 for(const x of KALAPAS_21)
  assert.equal(x.externalPossible,['temperature-octad','temperature-sound-nonad'].includes(x.id),x.id);
});
test('Ch VI §18 Pali bodily-intimation navaka is nine: octad plus bodily intimation',()=>{
 const x=KALAPAS_21.find(x=>x.id==='body-intimation-nonad');
 assert.equal(x.count,9);assert.deepEqual(sorted(x.members),union(OCTAD,[20]));
});
