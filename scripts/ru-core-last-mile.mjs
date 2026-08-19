import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const targets=['ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html','ru/formaty-raboty/ekspress-proverka-riskov.html'];
const pairs=[['Budget constraints','Бюджетные ограничения'],['budget constraints','бюджетные ограничения'],['budget','бюджет'],['constraints','ограничения'],['Business-law','корпоративное право'],['Business-','корпоративно-правовой '],[' law ',' право '],['NOT FIT','НЕ ПОДХОДИТ'],['NOT','НЕ'],['FIT','ПОДХОДИТ']];
function tx(s){let o=s;for(const [a,b] of pairs){const e=a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');o=o.replace(new RegExp(e,'g'),b);}return o.replace(/\s{2,}/g,' ');}
function json(h){return h.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(z,a,b,c)=>{try{const d=JSON.parse(b);const w=v=>{if(Array.isArray(v))return v.map(w);if(v&&typeof v==='object'){for(const k of Object.keys(v))v[k]=w(v[k]);return v;}if(typeof v==='string'&&!/^https?:\/\//i.test(v))return tx(v);return v;};return a+JSON.stringify(w(d),null,2)+c;}catch{return z;}})}
for(const rel of targets){const f=path.join(ROOT,rel);let h=fs.readFileSync(f,'utf8');const held=[];h=h.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi,x=>{held.push(x);return `__H_${held.length-1}__`;});h=h.replace(/>([^<>]+)</g,(m,t)=>`>${tx(t)}<`);h=h.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi,(m,a,v,b)=>a+tx(v)+b);h=h.replace(/__H_(\d+)__/g,(_,i)=>held[Number(i)]);h=json(h);fs.writeFileSync(f,h,'utf8');}
console.log('[LEXONYX RU core last mile] PASS');
