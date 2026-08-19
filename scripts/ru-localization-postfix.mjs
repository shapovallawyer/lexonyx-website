import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RU = path.join(ROOT, 'ru');
function files(dir, out=[]) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,ent.name);
    if (ent.isDirectory()) files(p,out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}
let changed=0;
for (const p of files(RU)) {
  const before=fs.readFileSync(p,'utf8');
  const after=before.replace(/\bworkstream\b/gi,'направление работы');
  if (after!==before) { fs.writeFileSync(p,after,'utf8'); changed++; }
}
console.log(`[LEXONYX RU localization postfix] changed=${changed}`);
