import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildMatrixCsv} from '../src/matrix-ui.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf-8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf-8');
const css=readFileSync(new URL('../ux.css',import.meta.url),'utf-8');

test('focused views isolate the high-density explorers without deleting their controls',()=>{
 const screens=['simulation','atlas','sampayoga','conditionality','sources'];
 for(const id of screens){
  assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,new RegExp(`data-view-target="${id}"`));
 }
 assert.match(html,/class="simulator-section view-section" id="simulation"/);
 for(const id of screens.slice(1))assert.match(html,new RegExp(`id="${id}"[^>]*hidden|hidden[^>]*id="${id}"`));
 assert.match(css,/\.view-section\[hidden\]/);
 assert.match(app,/function showView\(/);
});

test('all original V0.2 module-mount IDs remain unique and available',()=>{
 const allIds=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(allIds).size,allIds.length,'No duplicate IDs');
 const required=['door','intensity','mindClarity','javana','followMind','nextJavana','interludeCount','followOptions','playBtn','stepBtn','backBtn','resetBtn','speed','exportBtn','timeline','network','factorList','factorSearch','factorGroup','sourceLinks','matrixScheme','matrixRealm','matrixSearch','matrixCSV','matrixTable','matrixPage','matrixPrev','matrixNext','matrixDetail','conditionWithin','conditionIncoming','conditionBridges','conditionEdges','paccayaCatalog','conditionCount','repetitionCount','betweenCount'];
 for(const id of required)assert.ok(allIds.includes(id),`missing #${id}`);
});

test('progressive disclosure and beginner-friendly feedback stay connected to data model',()=>{
 for(const id of ['quickPresets','advancedScenario','factorPreview','factorPreviewCount','onlyActiveFactors','matrixFocus','conditionPlain','timelineProgress','progressFill'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/class="graph-disclosure"/);
 assert.match(html,/class="matrix-disclosure"/);
 assert.match(html,/class="mobile-tabs"/);
 assert.match(html,/id="quickStartBtn"/);
 assert.match(app,/quickStartBtn.*addEventListener/);
 assert.match(css,/\.quick-start-btn\{display:flex/);
 assert.match(app,/renderConditionPlain\(\)/);
 assert.match(app,/function updatePresetButtons\(\)/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('CSV export includes a valid header and all 89 or 121 citta rows',()=>{
 for(const size of [89,121]){
  const csv=buildMatrixCsv(size);
  const lines=csv.replace(/^\uFEFF/,'').split('\r\n');
  assert.equal(lines.length,size+1);
  assert.equal(lines[0].split(',').length,56); // 4 metadata columns + 52 factors
  assert.ok(lines[0].startsWith('"Citta ID","ชื่อจิต"'));
  assert.ok(lines.at(-1).includes('"ต้องเกิด"'));
 }
 assert.throws(()=>buildMatrixCsv(90),/Unknown citta scheme/);
});


test('causal decision controls and progressive reasoning are available without bloating the default view',()=>{
 for(const id of ['processMode','faculties','objectQuality','selectionMode','attention','reactionCue','nextAttention','nextReactionCue','tryCausalExample','causalInspector','ruleBasis','ruleExplanation','ruleSource'])
  assert.match(html,new RegExp(`id="${id}"`));
 assert.match(html,/id="ordinaryCausalControls"/);
 assert.match(html,/id="advancedScenario"/);
 assert.match(app,/function renderMomentRule/);
 assert.match(app,/configFromForm\(\)/);
 assert.match(css,/\.causal-why/);
});
