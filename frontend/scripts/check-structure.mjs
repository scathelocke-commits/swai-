import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const files = ['src/app/page.tsx', 'src/app/profile/page.tsx', 'src/app/requirements/page.tsx', 'src/app/courses/page.tsx', 'src/app/analysis/page.tsx', 'src/app/roadmap/page.tsx', 'src/app/layout.tsx', 'src/components/shell.tsx', 'src/context/demo-context.tsx', 'src/data/demo.json', 'tailwind.config.ts', 'vercel.json', '.env.local.example'];
for (const filename of files) assert.ok(existsSync(new URL(filename, root)), `Missing ${filename}`);
const nav = readFileSync(new URL('src/lib/helpers.ts', root), 'utf8');
for (const route of ['/', '/requirements', '/courses', '/analysis', '/roadmap']) assert.ok(nav.includes(`href: "${route}"`));
console.log('PASS: 6 routes, navigation, style configuration, JSON, and deployment configuration');
