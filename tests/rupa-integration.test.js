import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

test('Rūpa 28 is a distinct keyboard-reachable learning view and not cluttered in default simulation',()=>{
 const html=file('index.html');
 assert.match(html,/class="rupa-section view-section"[^>]*hidden[^>]*id="rupa"|class="rupa-section view-section"[^>]*id="rupa"[^>]*hidden/);
 assert.match(html,/id="rupaRoot"/);
 assert.ok((html.match(/data-view-target="rupa"/g)||[]).length>=3,'top, desktop, mobile navigation');
 assert.match(html,/id="simulation"/);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length);
});

test('Rūpa view mounts with existing JIT engine state; all existing workflow modules stay present',()=>{
 const app=file('src/app.js');
 assert.match(app,/from '\.\/rupa-ui\.js'/);
 assert.match(app,/mountRupa\(/);
 assert.match(app,/VIEWS=.*'rupa'/);
 assert.match(app,/page==='rupa'/);
 for(const t of ['createProcess','validateProcess','mountMatrix','mountConditions','render','showView'])assert.ok(app.includes(t));
 const html=file('index.html');
 for(const ref of ['src/app.js','ux.css'])assert.ok(html.includes(ref));
});

test('version, responsive 5 tabs, and provenance labels accompany the learning view',()=>{
 assert.match(file('index.html'),/V0\.6/);
 const css=file('ux.css');
 assert.match(css,/\.rupa-columns/);
 assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
 assert.match(file('README.md'),/Rūpa Engine/);
 assert.match(file('docs/RUPA_SOURCE_AUDIT.md'),/UNKNOWN ≠ PASS/);
});
