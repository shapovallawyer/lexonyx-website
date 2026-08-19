import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const banned = /\b(?:ownership|governance|substance|banking|workstreams?|Target State|Current State|Entity Necessity|Business Purpose|Operational Reality|operating|founder|management|people|customers|operations|investment activity|specialist|cross-border|local professional|architecture|analysis|entity|company|tax|regulatory|interface|interfaces|advisory|family office|decision-making|business purpose|material jurisdiction|headline tax outcome)\b/i;
const allowedWhole = /^(?:LEXONYX|KYC|AML|FATF|MiCA|OSS|IOSS|FAR|IP|PE|КИК|НДС|Rechtsanwalt|Steuerberater|SaaS|B2B|B2C)$/i;

function files(dir, out=[]) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,e.name);
    if(e.isDirectory()) files(p,out); else if(e.isFile()&&e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi,' ')
    .replace(/<!--([\s\S]*?)-->/g,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

const errors=[];
for(const f of files(path.join(ROOT,'ru'))){
  const rel=path.relative(ROOT,f).split(path.sep).join('/');
  const html=fs.readFileSync(f,'utf8');
  const text=visibleText(html);
  const m=text.match(banned);
  if(m && !allowedWhole.test(m[0])) errors.push(`${rel}: ${m[0]}`);
}
if(errors.length){
  console.error(`[LEXONYX RU language audit] FAILED — ${errors.length} page(s) still contain avoidable English terminology:`);
  for(const e of errors.slice(0,80)) console.error(' - '+e);
  process.exit(1);
}
console.log(`[LEXONYX RU language audit] PASS — Russian visible copy contains no banned mixed-language terminology`);
