import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CITTAS_121,SAMPAYOGA_121,SAMPAYOGA_89,associationCoverage,resolveSampayoga} from '../src/association.js';
import {CANONICAL_SAMPAYOGA_SOURCE,MANUAL_TABLES,sourceForCitta,manualLink} from '../src/sampayoga-source.js';

/** Independent witness transcribed from A Comprehensive Manual of Abhidhamma,
 * printed Table 2.3 p.101, and Table 2.2 p.92 with §§13–17 pp.95–99.
 * The matrix being checked is NOT used to produce the witness masks.
 */
test('CMA Table 1.1: independent reference covers every 121 numbered citta exactly once',()=>{
 assert.equal(CANONICAL_SAMPAYOGA_SOURCE.length,121);
 assert.deepEqual(CANONICAL_SAMPAYOGA_SOURCE.map(c=>c.id),Array.from({length:121},(_,i)=>i+1));
 for(const [i,row] of CANONICAL_SAMPAYOGA_SOURCE.entries()){
  assert.equal(sourceForCitta(i+1),row);
  assert.equal(row.eligible.length,row.printedTotal);
  assert.equal(new Set(row.eligible).size,row.printedTotal);
  assert.equal(row.required.length+row.optional.length,row.printedTotal);
  assert.equal(row.required.length+row.optional.length+row.excluded.length,52);
 }
 assert.throws(()=>sourceForCitta(122),/Unknown citta/);
 assert.throws(()=>sourceForCitta(0),/Unknown citta/);
});

test('CMA Tables 2.2 & 2.3: independently confirm all 121 × 52 = 6292 cell statuses',()=>{
 let compared=0;
 for(const [i,source] of CANONICAL_SAMPAYOGA_SOURCE.entries()){
  const implemented=SAMPAYOGA_121[i];
  assert.equal(source.id,implemented.id);
  for(let factor=1;factor<=52;factor++){
   const expected=source.required.includes(factor)?'required':source.optional.includes(factor)?'optional':'forbidden';
   const actual=implemented.mandatory.includes(factor)?'required':implemented.optional.includes(factor)?'optional':'forbidden';
   assert.equal(actual,expected,`citta ${source.id}, factor ${factor}, source ${source.printed}`);
   compared++;
  }
  assert.deepEqual(resolveSampayoga(source.id).active,source.required);
 }
 assert.equal(compared,6292);
});

test('CMA Table 1.1: citta class ranges independently agree with all 121 labels',()=>{
 const ranges=[
  [1,12,'akusala','kama'],[13,27,'vipaka','rootless'],[28,30,'kiriya','rootless'],
  [31,38,'kusala','kama-beautiful'],[39,46,'vipaka','kama-beautiful'],[47,54,'kiriya','kama-beautiful'],
  [55,59,'kusala','rupa'],[60,64,'vipaka','rupa'],[65,69,'kiriya','rupa'],
  [70,73,'kusala','arupa'],[74,77,'vipaka','arupa'],[78,81,'kiriya','arupa'],
  [82,101,'kusala','lokuttara'],[102,121,'vipaka','lokuttara']
 ];
 for(const [start,end,quality,realm] of ranges){
  for(let i=start;i<=end;i++){
   assert.equal(CITTAS_121[i-1].quality,quality,`citta ${i}`);
   assert.equal(CITTAS_121[i-1].realm,realm,`citta ${i}`);
  }
 }
 for(let group=0;group<8;group++)for(let level=1;level<=5;level++){
  const index=82+group*5+level-1;
  assert.equal(CITTAS_121[index-1].id89,82+group);
  assert.equal(CITTAS_121[index-1].jhana,level);
 }
});

test('CMA Table 2.3: all five supramundane jhāna patterns fixed, with three simultaneous virati',()=>{
 assert.deepEqual([0,1,2,3,4].map(j=>sourceForCitta(82+j).printedTotal),[36,35,34,33,33]);
 for(let id=82;id<=121;id++){
  assert.ok([47,48,49].every(f=>sourceForCitta(id).required.includes(f)));
  assert.ok([50,51].every(f=>sourceForCitta(id).excluded.includes(f)));
 }
});

test('CMA chapter II: conditional cetasikas explicitly remain conditional, no randomized co-arising',()=>{
 for(let id of [2,4,6,8,10])assert.deepEqual(sourceForCitta(id).optional.filter(x=>[25,26].includes(x)),[25,26]);
 for(let id=31;id<=38;id++)assert.deepEqual(sourceForCitta(id).optional,[47,48,49,50,51]);
 for(let id=39;id<=46;id++)assert.deepEqual(sourceForCitta(id).optional,[]);
 for(let id=82;id<=121;id++)assert.deepEqual(sourceForCitta(id).optional,[]);
 assert.throws(()=>resolveSampayoga(9,[22,23]),/Mutually exclusive/);
 assert.throws(()=>resolveSampayoga(31,[50,51]),/Mutually exclusive/);
 assert.throws(()=>resolveSampayoga(2,[25]),/co-arise/);
});

test('CMA 89 grouping is not a falsely fixed 121 mental-factor mask',()=>{
 for(let id=82;id<=89;id++){
  assert.equal(SAMPAYOGA_89[id-1].aggregate,true);
  assert.equal(SAMPAYOGA_89[id-1].variants.length,5);
  assert.equal(SAMPAYOGA_89[id-1].mandatory.every(id=>[1,2,3,4,5,6,7,10,11,13, ...Array.from({length:22},(_,i)=>i+28),52].includes(id)),true);
 }
});

test('each matrix source is explicit and each visible citta inspector lists all three statuses',()=>{
 assert.equal(MANUAL_TABLES.citta.page,28);
 assert.equal(MANUAL_TABLES.association.page,92);
 assert.equal(MANUAL_TABLES.combinations.page,101);
 assert.match(manualLink('combinations'),/#page=106$/);
 const ui=readFileSync(new URL('../src/matrix-ui.js',import.meta.url),'utf8');
 for(const word of ['sourceForCitta','row.mandatory','row.optional','row.prohibited','sourceLink','citta-study-dispute'])assert.ok(ui.includes(word),word);
 assert.match(ui,/\['required',row\.mandatory\],\['optional',row\.optional\],\['forbidden',row\.prohibited\]/);
});