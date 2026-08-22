import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const write = (rel, html) => fs.writeFileSync(path.join(ROOT, rel), html, 'utf8');

function walk(dir) {
  const out=[];
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...walk(p));
    else if(e.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

function replaceAllText(html, pairs) {
  for (const [a,b] of pairs) html=html.split(a).join(b);
  return html;
}

function section(html, token) {
  const rx=new RegExp(`<section\\b(?=[^>]*class=["'][^"']*\\b${token}\\b[^"']*["'])[^>]*>[\\s\\S]*?<\\/section>`,'i');
  const m=rx.exec(html);
  if(!m) throw new Error(`FM-01 consistency: section .${token} not found`);
  return {match:m[0], index:m.index};
}
function replaceInSection(html, token, transform) {
  const s=section(html,token);
  return html.slice(0,s.index)+transform(s.match)+html.slice(s.index+s.match.length);
}
function replaceFirstByClass(fragment, tag, classToken, content) {
  const rx=new RegExp(`(<${tag}\\b(?=[^>]*class=["'][^"']*\\b${classToken}\\b[^"']*["'])[^>]*>)[\\s\\S]*?(<\\/${tag}>)`,'i');
  if(!rx.test(fragment)) throw new Error(`FM-01 consistency: ${tag}.${classToken} not found`);
  return fragment.replace(rx,`$1${content}$2`);
}
function replaceCardParagraphs(fragment, gridClass, replacements) {
  const gridRx=new RegExp(`(<div\\b(?=[^>]*class=["'][^"']*\\b${gridClass}\\b[^"']*["'])[^>]*>)([\\s\\S]*?)(<\\/div>)`,'i');
  const gm=gridRx.exec(fragment);
  if(!gm) throw new Error(`FM-01 consistency: grid .${gridClass} not found`);
  let body=gm[2];
  let idx=0;
  body=body.replace(/(<article\b[^>]*>[\s\S]*?<p>)[\s\S]*?(<\/p>[\s\S]*?<\/article>)/gi,(m,a,b)=>{
    const value=replacements[idx++];
    return value===undefined?m:`${a}${value}${b}`;
  });
  return fragment.slice(0,gm.index)+gm[1]+body+gm[3]+fragment.slice(gm.index+gm[0].length);
}
function replaceFaqByIndex(html, answers) {
  let i=0;
  html=html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/gi,m=>{
    const answer=answers[i++];
    if(answer===undefined||answer===null) return m;
    return m.replace(/(<div\b[^>]*class=["'][^"']*lx-faq-answer[^"']*["'][^>]*>\s*<p>)[\s\S]*?(<\/p>\s*<\/div>)/i,`$1${answer}$2`);
  });
  html=html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi,(full,attrs,body)=>{
    let data; try{data=JSON.parse(body.trim());}catch{return full;}
    if(!data||data['@type']!=='FAQPage'||!Array.isArray(data.mainEntity)) return full;
    answers.forEach((answer,index)=>{ if(answer!==undefined&&answer!==null&&data.mainEntity[index]?.acceptedAnswer) data.mainEntity[index].acceptedAnswer.text=answer.replace(/&amp;/g,'&'); });
    return `<script type="application/ld+json">\n${JSON.stringify(data,null,2)}\n  </script>`;
  });
  return html;
}

// Canonical English product names. URLs remain unchanged.
for(const file of walk(path.join(ROOT,'en'))){
  let html=fs.readFileSync(file,'utf8');
  html=replaceAllText(html,[
    ['Strategic Structural Audit','Strategic Structure Audit'],
    ['strategic structural audit','Strategic Structure Audit'],
    ['Rapid Risk Review','Express Risk Review'],
    ['rapid risk review','Express Risk Review'],
    ['A rapid review','An Express Risk Review'],
    ['a rapid review','an Express Risk Review'],
    ['rapid review','Express Risk Review']
  ]);
  fs.writeFileSync(file,html,'utf8');
}

const CFG={
  en:{
    file:'en/expertise/tax-residency-cfc.html',
    hero:'Corporate tax residence does not follow one universal test. Depending on the jurisdiction, relevant connecting factors may include incorporation, statutory seat, place of management or other domestic-law criteria. LEXONYX maps the underlying facts and coordinates the jurisdiction-specific analysis.',
    trigger:'A founder relocates — and it may look like a personal tax question. In practice, the move can change facts relevant to company management, CFC exposure, PE-risk and banking. Whether legal or tax consequences follow depends on the rules of the jurisdictions involved and any applicable treaty.',
    problem:[
      'There is no single international management or residence test. The facts about who actually manages the company, where relevant acts are performed and how authority is exercised must be tested against the law of each relevant jurisdiction.',
      'If income, authority or management functions are exercised from another country, the structure may require a fresh residence, CFC and governance analysis. Incorporation remains relevant where the applicable law makes it relevant.',
      'A tax authority applies its domestic rules and, where relevant, an applicable treaty to the actual facts. Corporate records are evidence of the structure, but they do not replace the underlying management reality.'
    ],
    analysis:'Where the company is actually managed, which functions and decisions are carried out in each country, who exercises authority and how those facts are evidenced at process and document level.',
    faq:[
      'There is no single universal test for corporate tax residence. Depending on the jurisdiction, relevant connecting factors may include incorporation, statutory seat, place of management or other domestic-law criteria. LEXONYX maps the underlying facts; the applicable jurisdiction-specific test is then applied or confirmed by the relevant tax specialist.',
      'CFC rules are domestic anti-deferral regimes. Whether they affect an owner depends on the law applicable to that owner, including the statutory control, entity, income and exemption tests. LEXONYX maps ownership and control facts; jurisdiction-specific CFC conclusions are provided or confirmed by the relevant tax specialist.',
      'Corporate documents describe formal roles and authority. Actual management concerns what is done in practice, but the legal significance of those facts depends on the residence or management test used by the relevant jurisdiction. The analysis therefore starts with the real decision and management process and then applies the correct domestic or treaty test.',
      null,
      'Risk may arise where the facts of management, authority, functions or control do not match the assumptions on which the structure was designed, or where a change of location engages a residence or management test in another jurisdiction. The legal consequence must be determined under the relevant domestic law and any applicable treaty.'
    ]
  },
  ru:{
    file:'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
    hero:'Регистрация компании — только один из возможных факторов. В зависимости от юрисдикции значение могут иметь регистрация, статутное местонахождение, место управления или другие критерии внутреннего права. LEXONYX картирует фактические обстоятельства, а применимый налоговый вывод подтверждается профильным специалистом соответствующей юрисдикции.',
    trigger:'Основатель переехал — и кажется, что это личный налоговый вопрос. На практике переезд может изменить факты, имеющие значение для управления компанией, её налогового резидентства, КИК, постоянного представительства и банковской картины. Возникнут ли правовые или налоговые последствия, зависит от правил соответствующих юрисдикций и применимого соглашения, если оно есть.',
    problem:[
      'Для разных юрисдикций применяются разные тесты управления и резидентства. Поэтому факты о том, кто и где реально управляет компанией, нужно сопоставлять с конкретным применимым правом.',
      'Если доход, полномочия или управленческие функции фактически сосредоточены в другой стране, структуру может потребоваться заново проверить на резидентство, КИК и систему управления. Значение регистрации зависит от применимого права.',
      'Налоговый орган применяет нормы своей юрисдикции и, при наличии, соответствующее налоговое соглашение к фактическим обстоятельствам. Корпоративные документы служат доказательством, но не заменяют реальную модель управления.'
    ],
    analysis:'Где и как фактически управляется компания, какие функции и решения выполняются в каждой стране, кто осуществляет полномочия и как это подтверждается процессами и документами.',
    faq:[
      'Универсального международного теста корпоративного налогового резидентства нет. В зависимости от юрисдикции значение могут иметь регистрация, статутное местонахождение, место управления или другие критерии внутреннего права. LEXONYX картирует фактические обстоятельства, а применимый юрисдикционный тест затем применяется или подтверждается профильным налоговым специалистом.',
      'Правила КИК являются нормами внутреннего налогового права. Их применимость к собственнику зависит от законодательства соответствующей юрисдикции, включая тесты контроля, статуса иностранной компании, характера дохода и предусмотренные исключения. LEXONYX картирует ownership и control; юрисдикционные налоговые выводы предоставляет или подтверждает профильный специалист.',
      'Корпоративные документы описывают формальные роли и полномочия. Фактическое управление показывает, что происходит на практике, но юридическое значение этих фактов зависит от теста резидентства или управления конкретной юрисдикции. Поэтому анализ начинается с реального процесса управления и только затем применяет соответствующие нормы внутреннего права и соглашения.',
      null,
      'Риск может возникать, когда фактическое управление, полномочия, функции или контроль не соответствуют исходным предпосылкам структуры либо изменение места деятельности задействует тест резидентства другой юрисдикции. Конкретное последствие определяется по применимому внутреннему праву и налоговому соглашению, если оно действует.'
    ]
  },
  uk:{
    file:'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
    hero:'Реєстрація компанії — лише один із можливих факторів. Залежно від юрисдикції значення можуть мати реєстрація, статутне місцезнаходження, місце управління або інші критерії внутрішнього права. LEXONYX картує фактичні обставини, а застосовний податковий висновок підтверджується профільним фахівцем відповідної юрисдикції.',
    trigger:'Засновник переїхав — і здається, що це особисте податкове питання. На практиці переїзд може змінити факти, важливі для управління компанією, її податкового резидентства, КІК, постійного представництва та банківської картини. Чи виникнуть правові або податкові наслідки, залежить від правил відповідних юрисдикцій і застосовної податкової угоди, якщо вона є.',
    problem:[
      'Різні юрисдикції застосовують різні тести управління та резидентства. Тому факти про те, хто і де реально управляє компанією, потрібно зіставляти з конкретним застосовним правом.',
      'Якщо дохід, повноваження або управлінські функції фактично зосереджені в іншій країні, структуру може знадобитися повторно перевірити щодо резидентства, КІК і системи управління. Значення реєстрації залежить від застосовного права.',
      'Податковий орган застосовує норми своєї юрисдикції та, за наявності, відповідну податкову угоду до фактичних обставин. Корпоративні документи є доказами, але не замінюють реальну модель управління.'
    ],
    analysis:'Де і як фактично управляється компанія, які функції та рішення здійснюються в кожній країні, хто реалізує повноваження і як ці факти підтверджуються процесами та документами.',
    faq:[
      'Універсального міжнародного тесту корпоративного податкового резидентства немає. Залежно від юрисдикції значення можуть мати реєстрація, статутне місцезнаходження, місце управління або інші критерії внутрішнього права. LEXONYX картує фактичні обставини, а застосовний юрисдикційний тест потім застосовується або підтверджується профільним податковим фахівцем.',
      'Правила КІК є нормами внутрішнього податкового права. Їх застосовність до власника залежить від законодавства відповідної юрисдикції, включно з тестами контролю, статусу іноземної компанії, характеру доходу та передбаченими винятками. LEXONYX картує ownership і control; юрисдикційні податкові висновки надає або підтверджує профільний фахівець.',
      'Корпоративні документи описують формальні ролі та повноваження. Фактичне управління показує, що відбувається на практиці, але юридичне значення цих фактів залежить від тесту резидентства або управління конкретної юрисдикції. Тому аналіз починається з реального процесу управління і лише потім застосовує відповідні норми внутрішнього права та податкової угоди.',
      null,
      'Ризик може виникати, коли фактичне управління, повноваження, функції або контроль не відповідають вихідним припущенням структури або зміна місця діяльності задіює тест резидентства іншої юрисдикції. Конкретний наслідок визначається за застосовним внутрішнім правом і податковою угодою, якщо вона діє.'
    ]
  }
};

for(const c of Object.values(CFG)){
  let html=read(c.file);
  html=replaceInSection(html,'tax-hero',s=>replaceFirstByClass(s,'p','page-subtitle',c.hero));
  html=replaceInSection(html,'expertise-trigger-band',s=>s.replace(/(<p>)[\s\S]*?(<\/p>)/i,`$1${c.trigger}$2`));
  html=replaceInSection(html,'section-light',s=>s); // structural no-op; guards page shape
  const gridToken='tax-problem-grid';
  const gRx=new RegExp(`(<div\\b(?=[^>]*class=["'][^"']*\\b${gridToken}\\b[^"']*["'])[^>]*>)([\\s\\S]*?)(<\\/div>)`,'i');
  const gm=gRx.exec(html);
  if(!gm) throw new Error(`FM-01 consistency: .${gridToken} not found in ${c.file}`);
  let body=gm[2], i=0;
  body=body.replace(/(<article\b[^>]*>[\s\S]*?<p>)[\s\S]*?(<\/p>[\s\S]*?<\/article>)/gi,(m,a,b)=>`${a}${c.problem[i++] ?? ''}${b}`);
  html=html.slice(0,gm.index)+gm[1]+body+gm[3]+html.slice(gm.index+gm[0].length);
  const ag=/((?:<div\b[^>]*class=["'][^"']*tax-analysis-grid[^"']*["'][^>]*>)[\s\S]*?<article\b[^>]*>[\s\S]*?<p>)[\s\S]*?(<\/p>)/i;
  if(!ag.test(html)) throw new Error(`FM-01 consistency: first tax analysis paragraph not found in ${c.file}`);
  html=html.replace(ag,`$1${c.analysis}$2`);
  html=replaceFaqByIndex(html,c.faq);
  write(c.file,html);
}

console.log('[FM-01 site consistency] PASS — structure-aware jurisdiction-neutral tax copy and canonical EN work-format names applied');
