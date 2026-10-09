// Build entry point: validate data, regenerate the skill catalog, and build the gallery site.
// Usage: node scripts/build.mjs [--check]   (--check validates only, writes nothing)
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadStyles, loadCandidates } from './lib/load.mjs';
import { writeCatalog, injectSkillTable, injectReadmeTables } from './lib/catalog.mjs';
import { buildSite } from './lib/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const { styles, errors } = await loadStyles(root);
const candidates = await loadCandidates(root);

if (errors.length) {
  console.error(`Validation failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`OK: ${styles.length} styles, ${candidates.length} candidates`);
if (checkOnly) process.exit(0);

await writeCatalog(root, styles);
await injectSkillTable(root, styles);
await injectReadmeTables(root, styles);
console.log('Wrote skill/references/catalog.md and the style tables in SKILL.md and both READMEs');

await buildSite(root, styles, candidates);
