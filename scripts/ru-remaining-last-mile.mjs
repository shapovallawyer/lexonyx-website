import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const targets=['ru/kontakty.html','ru/zaprosit-razbor.html','ru/cookie-policy.html','ru/privacy-policy.html','ru/terms-of-use.html','ru/intake/intake.html','ru/intake/intake_thankyou.html','ru/intake/spasibo.html'];
const pairs=[
['International advisory','международное консультационное сопровождение'],['international advisory','международное консультационное сопровождение'],['International','Международный'],['international','международный'],
['tracking','отслеживание'],['Tracking','Отслеживание'],['property','ресурс'],['Property','Ресурс'],
['email','электронная почта'],['Email','Электронная почта'],['limitation','ограничение'],['Limitation','Ограничение'],
['Licensing','Лицензирование'],['licensing','лицензирование'],['as available','по мере доступности'],['As available','По мере доступности']
];
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function rep(t,a,b){const l=/^[A-Za-z0-9]/.test(a)?'(?<![A-Za-z0-9])':'';const r=/[A-Za-z0-9]$/.test(a)?'(?![A-Za-z0-9])':'';return t.replace(new RegExp(l+esc(a)+r,'g'),b);}
function clean(t){let o=t;for(const [a,b] of pairs)o=rep(o,a,b);return o.replace(/\s{2,}/g,' ').replace(/\s+([,.;:!?])/g,'$1');}
function json(h){return h.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(all,a,b,c)=>{try{const d=JSON.parse(b);const w=v=>{if(Array.isArray(v))return v.map(w);if(v&&typeof v==='object'){for(const k of Object.keys(v))v[k]=w(v[k]);return v;}if(typeof v==='string'&&!/^https?:\/\//i.test(v))return clean(v);return v;};return a+JSON.stringify(w(d),null,2)+c;}catch{return all;}})}
for(const rel of targets){const f=path.join(ROOT,rel);if(!fs.existsSync(f))continue;let h=fs.readFileSync(f,'utf8');const held=[];h=h.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi,x=>{held.push(x);return `__RU_LAST_${held.length-1}__`;});h=h.replace(/>([^<>]+)</g,(m,t)=>`>${clean(t)}<`);h=h.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi,(m,a,v,b)=>a+clean(v)+b);h=h.replace(/__RU_LAST_(\d+)__/g,(_,i)=>held[Number(i)]);h=json(h);fs.writeFileSync(f,h,'utf8');}
console.log('[LEXONYX RU remaining last mile] PASS');
