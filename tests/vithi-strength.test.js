import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSenseCourse,SENSE_GRADES,MIND_GRADES,VITHI_SOURCE} from '../src/vithi-strength.js';
import {planVithi} from '../src/causal.js';
import {createProcess,validateProcess} from '../src/engine.js';

// Independent handbook evidence: one full, two javana-only, six determining,
// six futile courses (CMA IV §§6-10); not generated from the engine output.
const reference=[
 ['very-great',[1],'register',7,2],
 ['great',[2,3],'javana',7,0],
 ['slight',[4,5,6,7,8,9],'determine',0,0],
 ['very-slight',[10,11,12,13,14,15],'vibrate',0,0]
];
test('four physical sense-object presentations and two mind-door clarities are distinct',()=>{
 assert.deepEqual(SENSE_GRADES.map(x=>x.id),reference.map(x=>x[0]));
 assert.deepEqual(MIND_GRADES.map(x=>x.id),['clear','obscure']);
 assert.ok(VITHI_SOURCE.url.includes('vithi-sangaha'));
 assert.equal(reference.reduce((n,x)=>n+x[1].length,0),15);
});
test('all fifteen manual variants match the transition planner and 17-slot frame',()=>{
 for(const [grade,delays,last,j,r] of reference)for(const delay of delays){
  const config={intensity:grade,objectDelay:String(delay)};
  const profile=buildSenseCourse(config);
  const p=createProcess(config);
  assert.equal(profile.objectSpan,17);
  assert.equal(profile.slots.length,17);
  assert.equal(profile.pastCount,delay);
  assert.equal(profile.slots.filter(x=>x.kind==='continuation').length,profile.continuationCount);
  assert.equal(profile.activeCount+profile.continuationCount,17);
  assert.equal(profile.stages.at(-1),last);
  assert.equal(profile.javanaCount,j);assert.equal(profile.registrationCount,r);
  assert.deepEqual(p.moments.map(m=>m.stage),profile.stages);
  assert.deepEqual(planVithi(p.config,'five-door').map(x=>x.stage),profile.stages);
  assert.equal(p.cycles[0].course.pastCount,delay);
  assert.equal(validateProcess(p),true);
 }
});
test('in a slight object, determining repeats 2-3 times and javana never arises',()=>{
 for(const delay of [4,5,6,7,8,9]){
  const c=buildSenseCourse({intensity:'slight',objectDelay:delay});
  assert.equal(c.stages.filter(x=>x==='determine').length,delay===9?2:3);
  assert.equal(c.stages.includes('javana'),false);
  assert.equal(c.stages.includes('register'),false);
 }
});
test('very slight only vibrates bhavanga, and a 10-past subtype visibly returns to bhavanga',()=>{
 const p=createProcess({intensity:'very-slight',objectDelay:10});
 const c=p.cycles[0].course;
 assert.equal(c.continuationCount,5);
 assert.equal(c.slots.slice(12).every(x=>x.stage==='continuation'),true);
 assert.equal(c.stages.filter(x=>x==='vibrate').length,2);
 assert.equal(c.stages.some(x=>['arrest','five_advert','sense','receive','investigate','determine','javana','register'].includes(x)),false);
});
test('wrong delay and forged subtype evidence fail instead of being silently accepted',()=>{
 assert.throws(()=>createProcess({intensity:'slight',objectDelay:3}),/Object delay/);
 assert.throws(()=>createProcess({intensity:'great',objectDelay:9}),/Object delay/);
 assert.throws(()=>createProcess({intensity:'very-great',objectDelay:'n/a'}),/Object delay/);
 const p=createProcess({intensity:'great',objectDelay:3});
 p.cycles[0].course={...p.cycles[0].course,continuationCount:7};
 assert.throws(()=>validateProcess(p),/Five-door grade/);
});
test('mind-door sequence does not incorrectly inherit five-door 17-slot physical lifetime',()=>{
 for(const [grade,n] of [['clear',12],['obscure',10]]){
  const p=createProcess({door:'mind',mindClarity:grade});
  assert.equal(p.moments.length,n);
  assert.equal(p.cycles[0].kind,'mind-door');
  assert.equal('course' in p.cycles[0],false);
 }
});
test('a visible four-grade selector, delay chooser and 17 slots connect to actual engine',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/strength-ui.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../ux.css',import.meta.url),'utf8');
 for(const id of ['strengthPanel','strengthSenseGrades','strengthMindGrades','strengthDelay','strengthWindow','strengthOutcome','strengthStop'])
  assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(app,/mountStrength/);
 assert.match(app,/strengthUi\.render\(process,current\)/);
 assert.match(ui,/function syncGrade\(/);
 assert.match(ui,/continuation/);
 assert.match(css,/grid-template-columns:repeat\(17,minmax\(0,1fr\)\)/);
});
