import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const game=readFileSync(new URL('../sai-dhamma/index.html',import.meta.url),'utf8');
const studyURL=new URL('../#simulation','https://nustanakritwithai.github.io/Jit/sai-dhamma/?utm_source=chatgpt.com');

test('two game UI entry points open the real JIT cognitive-process page without tracking query',()=>{
 assert.equal(studyURL.href,'https://nustanakritwithai.github.io/Jit/#simulation');
 assert.match(game,/<a id="studyVithiLink"[^>]*data-jit-study[^>]*href="\.\.\/#simulation"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
 assert.match(game,/id="studyVithiCardLink"[^>]*data-jit-study[^>]*href="\.\.\/#simulation"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
 assert.equal((game.match(/data-jit-study/g)||[]).length,3); // two links, one click handler
 assert.match(game,/เรียนรู้วิถีจิตกับ JIT/);
 assert.doesNotMatch(game,/href="[^"]+(?:fbclid|utm_source)=[^"]+"/);
});

test('launching learning tab persists the game and leaves current save schema intact',()=>{
 assert.match(game,/document\.addEventListener\('click',function\(e\)\{var a=e\.target\.closest\('a\[data-jit-study\]'\);if\(a\)save\(\)\}\);/);
 assert.match(game,/KEY='saidhamma\.v01'/);
 assert.match(game,/function save\(\)\{if\(!S\)return;S\.savedAt/);
 assert.match(game,/target="_blank" rel="noopener noreferrer"/);
 assert.match(game,/id="goHead"/);
 assert.match(game,/id="goEvents"/);
});

test('learning links are visibly integrated into responsive game UI',()=>{
 assert.match(game,/\.dock-actions \.dock-study\{/);
 assert.match(game,/\.study-jit-card\{/);
 assert.match(game,/@media\(max-width:380px\)/);
 assert.match(game,/\.study-jit-action\{/);
});
