import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../src/data/demo.json', import.meta.url), 'utf8'));
const other = JSON.parse(readFileSync(new URL('../../backend/data/demo.json', import.meta.url), 'utf8'));
assert.deepEqual(data, other, 'Backend/frontend demo JSON must match');
const required = data.requirements.sections;
assert.equal(required.reduce((s, r) => s + r.credits, 0), data.requirements.total, 'Graduation credits breakdown must sum to total');
assert.deepEqual(data.scenarios.map(s=>s.id).sort(), ['complete','course','partial']);
for (const scenario of data.scenarios) {
  const total = required.reduce((sum, sec) => sum + scenario.credits[sec.id], 0);
  const shortage = required.reduce((sum, sec) => sum + Math.max(0, sec.credits - scenario.credits[sec.id]), 0);
  assert.equal(total, scenario.earned, `${scenario.id}: completed category credits must sum to earned`);
  assert.equal(shortage, scenario.missingCredits, `${scenario.id}: category shortages must sum to missing credits`);
  assert.equal(Math.max(0, data.requirements.total - scenario.earned), scenario.missingCredits, `${scenario.id}: shortfall must match overall total`);
  const roadmap = data.roadmaps[scenario.id];
  assert.equal(roadmap.length, 3, '3 demo semesters required');
  const planned = roadmap.flatMap(term => term.courses).filter(c => !c.optional).reduce((sum,c)=>sum+c.credits,0);
  if (scenario.id === 'partial') assert.equal(planned, scenario.missingCredits, 'Partial scenario roadmap must cover shortages');
  if (scenario.id === 'complete') assert.equal(planned, 0, 'Complete scenario requires no courses');
}
console.log('PASS: synced demo data, 130-credit split, all three analysis scenarios, and roadmap consistency');
