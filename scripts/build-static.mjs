import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
if (!output.startsWith(resolve(root) + sep)) throw new Error('Unsafe output path');
rmSync(output, { recursive: true, force: true });
mkdirSync(output);
for (const name of ['index.html', 'pages', 'js', 'styles', 'imgs']) {
  cpSync(resolve(root, name), resolve(output, name), { recursive: true });
}
