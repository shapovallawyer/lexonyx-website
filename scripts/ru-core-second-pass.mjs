import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'ru/index.html',
  'ru/ekspertiza/index.html',
  'ru/ekspertiza/strukturirovanie-gruppy.html',
  'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
  'ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html',
  'ru/ekspertiza/bankovskaya-gotovnost.html',
  'ru/ekspertiza/substance-i-governance.html',
  'ru/ekspertiza/vat-i-transgranichnye-modeli.html',
  'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html',
  'ru/ekspertiza/source-of-funds.html',
  'ru/ekspertiza/chastnyy-kapital-i-family-office.html',
  'ru/formaty-raboty/index.html',
  'ru/formaty-raboty/kak-nachat.html',
  'ru/formaty-raboty/ekspress-proverka-riskov.html',
  'ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html',
  'ru/formaty-raboty/soprovozhdenie-i-advisory.html',
  'ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html',
  'ru/o-praktike/index.html',
  'ru/o-praktike/kto-my.html',
  'ru/o-praktike/kak-my-rabotaem.html'
];

const phrases = [
  ['International tax', 'международное налогообложение'],
  ['International teams', 'международные команды'],
  ['Banking readiness', 'банковская готовность'],
  ['Tax residency', 'налоговое резидентство'],
  ['Transfer pricing', 'трансфертное ценообразование'],
  ['Regulatory fit', 'соответствие регуляторным требованиям'],
  ['Holding structure', 'холдинговая структура'],
  ['Operating companies', 'операционные компании'],
  ['Service / sales hub', 'сервисный или сбытовой центр'],
  ['Principal distributor', 'основной дистрибьютор'],
  ['cash management', 'управление денежными средствами'],
  ['Private capital', 'частный капитал'],
  ['beneficial ownership', 'фактическое право на доход'],
  ['fixed establishment risk', 'риск постоянного учреждения для целей НДС'],
  ['fixed establishment', 'постоянное учреждение для целей НДС'],
  ['Source of funds', 'происхождение средств'],
  ['Source of wealth', 'происхождение капитала'],
  ['source of funds', 'происхождение средств'],
  ['source of wealth', 'происхождение капитала'],
  ['group architecture', 'архитектура группы'],
  ['group structure', 'структура группы'],
  ['business explanation', 'описание бизнес-модели'],
  ['supporting docs', 'подтверждающие документы'],
  ['follow-up', 'последующие запросы'],
  ['after-submission', 'после подачи документов'],
  ['product strategy', 'стратегия продукта'],
  ['people footprint', 'фактическое присутствие команды'],
  ['Management & Control', 'управление и контроль'],
  ['Economic Reality', 'экономическая реальность'],
  ['Banking readiness', 'банковская готовность'],
  ['Registration vs economic reality', 'регистрация и экономическая реальность'],
  ['Decision-making location', 'место принятия решений'],
  ['Functional presence', 'фактическое присутствие функций'],
  ['Risk assumption', 'принятие рисков'],
  ['Board evidence', 'документы органов управления'],
  ['Structural alignment', 'соответствие структуры фактической модели'],
  ['Transaction mapping', 'картирование операций'],
  ['Marketplace model', 'модель маркетплейса'],
  ['Jurisdiction choice', 'выбор юрисдикции'],
  ['Compliance framework', 'система соблюдения требований'],
  ['licensing path', 'путь лицензирования'],
  ['capital requirements', 'требования к капиталу'],
  ['market access', 'доступ к рынку'],
  ['operational design', 'операционная модель'],
  ['full licence', 'полная лицензия'],
  ['agent / distributor model', 'модель агента или дистрибьютора'],
  ['staged approach', 'поэтапный подход'],
  ['transitional periods', 'переходные периоды'],
  ['prudential safeguards', 'пруденциальные меры защиты'],
  ['supervisory expectations', 'ожидания надзорного органа'],
  ['entry routes', 'варианты выхода на рынок'],
  ['Payments / crypto', 'платежи и криптоактивы'],
  ['sanity check', 'контрольная проверка'],
  ['architectural redesign', 'перестройка архитектуры'],
  ['employee / contractor', 'сотрудник или подрядчик'],
  ['structured intake', 'структурированный сбор исходных данных'],
  ['licensing / operational change', 'лицензирование или изменение операционной модели'],
  ['coherent state', 'согласованное состояние'],
  ['periodic coordination', 'периодическая координация'],
  ['ongoing support', 'постоянное сопровождение'],
  ['Family business', 'семейный бизнес'],
  ['European Union', 'Европейский союз'],
  ['United Kingdom', 'Великобритания'],
  ['United Arab Emirates', 'Объединённые Арабские Эмираты'],
  ['Local counsel', 'местные профильные специалисты'],
  ['local counsel', 'местные профильные специалисты'],
  ['people model', 'модель команды'],
  ['employee / contractor model', 'модель работы с сотрудниками и подрядчиками'],
  ['e-commerce', 'электронная торговля'],
  ['marketplaces', 'маркетплейсы'],
  ['marketplace', 'маркетплейс'],
  ['fulfillment', 'фулфилмент'],
  ['FinTech', 'финансовые технологии'],
  ['SaaS', 'программные продукты по подписке'],
  ['Substance', 'фактическое экономическое присутствие'],
  ['substance', 'фактическое экономическое присутствие'],
  ['narrative', 'описание'],
  ['treasury', 'казначейство'],
  ['intangibles', 'нематериальные активы'],
  ['DevelopmentCo', 'компания-разработчик'],
  ['fees', 'вознаграждения'],
  ['services', 'услуги'],
  ['dividends', 'дивиденды'],
  ['interest', 'проценты'],
  ['royalties', 'роялти'],
  ['beneficial', 'фактический'],
  ['holding', 'холдинговый'],
  ['service', 'сервисный'],
  ['control', 'контроль'],
  ['evidence', 'доказательства'],
  ['mapping', 'картирование'],
  ['residence', 'резидентство'],
  ['analysis', 'анализ'],
  ['people', 'команда'],
  ['function', 'функция'],
  ['contractors', 'подрядчики'],
  ['employees', 'сотрудники'],
  ['jurisdiction-specific', 'относящийся к конкретной юрисдикции'],
  ['conclusion', 'вывод'],
  ['conclusions', 'выводы'],
  ['payments', 'платежи'],
  ['wealth', 'капитал'],
  ['FRAMEWORK', 'СИСТЕМА'],
  ['GOVERNANCE', 'КОРПОРАТИВНОЕ УПРАВЛЕНИЕ'],
  ['ONBOARDING', 'БАНКОВСКАЯ ПРОВЕРКА'],
  ['REGULATORY ARCHITECTURE', 'РЕГУЛЯТОРНАЯ АРХИТЕКТУРА'],
  ['REGULATORY', 'РЕГУЛЯТОРНЫЙ ПЕРИМЕТР'],
  ['Jurisdiction', 'Юрисдикция'],
  ['Regulatory', 'Регуляторный'],
  ['Compliance', 'Соблюдение требований'],
  ['architecture', 'архитектура'],
  ['licensing', 'лицензирование'],
  ['requirements', 'требования'],
  ['access', 'доступ'],
  ['passporting', 'паспортизация услуг'],
  ['operational', 'операционный'],
  ['design', 'модель'],
  ['licence', 'лицензия'],
  ['exemption', 'исключение'],
  ['agent', 'агент'],
  ['distributor', 'дистрибьютор'],
  ['staged', 'поэтапный'],
  ['approach', 'подход'],
  ['logic', 'логика'],
  ['current-law', 'по действующему праву'],
  ['re-authorisation', 'повторное лицензирование'],
  ['paths', 'варианты'],
  ['routes', 'маршруты'],
  ['safeguarding', 'защита клиентских средств'],
  ['authorisation', 'лицензирование'],
  ['supervisory', 'надзорный'],
  ['Exemptions', 'Исключения'],
  ['Limited network', 'Ограниченная сеть'],
  ['small business', 'малый бизнес'],
  ['coordination with', 'координация с'],
  ['process', 'процесс'],
  ['backbone', 'основа'],
  ['documentation', 'документация'],
  ['enterprise', 'крупный бизнес'],
  ['Screening', 'Первичная проверка'],
  ['Go / Fix / Deeper', 'Продолжить / исправить / углубить анализ'],
  ['WHEN TO USE', 'КОГДА ИСПОЛЬЗОВАТЬ'],
  ['first-pass', 'первичная'],
  ['regulated perimeter', 'регуляторный периметр'],
  ['WHAT TO PREPARE', 'ЧТО ПОДГОТОВИТЬ'],
  ['NDA', 'соглашение о конфиденциальности'],
  ['engagement', 'поручение'],
  ['SCOPE', 'ОБЪЁМ РАБОТЫ'],
  ['PEOPLE', 'КОМАНДА'],
  ['presence', 'присутствие'],
  ['scale-up', 'растущий бизнес'],
  ['Family', 'Семейный'],
  ['Governance', 'Корпоративное управление'],
  ['about', 'о практике'],
  ['independent', 'независимый'],
  ['boutique', 'специализированная практика'],
  ['Boutique', 'Специализированная практика'],
  ['scope', 'периметр'],
  ['model', 'модель'],
  ['Advisory', 'Консультационное сопровождение'],
  ['advisory', 'консультационное сопровождение'],
  ['International', 'Международный'],
  ['teams', 'команды'],
  ['Banking', 'Банковская деятельность'],
  ['Tax', 'Налоговые вопросы'],
  ['Transfer', 'Трансфертное'],
  ['pricing', 'ценообразование'],
  ['Holding', 'Холдинговая'],
  ['Operating', 'Операционные'],
  ['Service', 'Сервисный'],
  ['Principal', 'Основной'],
  ['entity', 'компания'],
  ['chain', 'цепочка'],
  ['risk', 'риск'],
  ['Private', 'Частный'],
  ['capital', 'капитал'],
  ['Ownership', 'Структура владения'],
  ['CFC', 'КИК'],
  ['PE', 'постоянное представительство'],
  ['IP', 'интеллектуальная собственность'],
  ['M&A', 'слияния и поглощения'],
  ['DD', 'комплексная проверка'],
  ['FBA', 'логистика маркетплейса']
];

function applyText(text) {
  let out = text;
  for (const [from,to] of phrases.sort((a,b)=>b[0].length-a[0].length)) {
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    out = out.replace(new RegExp(`(?<![A-Za-z])${esc}(?![A-Za-z])`, 'g'), to);
  }
  return out.replace(/\s{2,}/g,' ');
}

function applyJson(html) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(all,a,b,c)=>{
    try {
      const data=JSON.parse(b);
      const walk=v=>{
        if(Array.isArray(v)) return v.map(walk);
        if(v&&typeof v==='object'){ for(const k of Object.keys(v)) v[k]=walk(v[k]); return v; }
        if(typeof v==='string'&&!/^https?:\/\//i.test(v)) return applyText(v);
        return v;
      };
      return a+JSON.stringify(walk(data),null,2)+c;
    } catch { return all; }
  });
}

function capitalizeBlocks(html){
  return html.replace(/(<(?:p|h1|h2|h3|h4)\b[^>]*>)([\s\S]*?)(<\/(?:p|h1|h2|h3|h4)>)/gi,(all,a,b,c)=>{
    const m=b.match(/^([\s\S]*?>)?\s*([а-яё])/i);
    if(!m) return all;
    // Uppercase only when the first visible Cyrillic character is lowercase.
    let done=false;
    const nb=b.replace(/[а-яё]/,ch=>{ if(done) return ch; done=true; return ch.toUpperCase(); });
    return a+nb+c;
  });
}

for(const rel of targets){
  const file=path.join(ROOT,rel);
  if(!fs.existsSync(file)) continue;
  let html=fs.readFileSync(file,'utf8');
  const held=[];
  html=html.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi,block=>{held.push(block);return `__HELD_${held.length-1}__`;});
  html=html.replace(/>([^<>]+)</g,(m,t)=>`>${applyText(t)}<`);
  html=html.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi,(m,a,v,b)=>a+applyText(v)+b);
  html=html.replace(/__HELD_(\d+)__/g,(_,i)=>held[Number(i)]);
  html=applyJson(html);
  html=capitalizeBlocks(html);
  fs.writeFileSync(file,html,'utf8');
}
console.log(`[LEXONYX RU core second pass] pages=${targets.length}`);
