import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const failures = [];

const expected = {
  'en/index.html': ['fragmented cross-border setup', 'material gaps'],
  'en/expertise/group-structuring.html': ['When group structuring is the right starting point', 'current-state map'],
  'en/expertise/banking-readiness.html': ['Prepare the structure before a bank or payment provider asks the difficult questions', 'What banks and payment providers need to understand quickly'],
  'en/expertise/tax-residency-cfc.html': ['qualified tax specialists', 'Which facts change the tax-residence and CFC analysis'],
  'en/work-formats/strategic-structural-audit.html': ['When a system-level audit is useful', 'prioritised implementation plan'],
  'en/how-to-start.html': ['Start with the smallest useful scope', 'You do not need to know which service you need'],
  'en/request-review.html': ['What happens after you submit', 'Initial issue map', 'not to produce an automated legal or tax conclusion'],

  'ru/index.html': ['разрозненную трансграничную конструкцию', 'существенные разрывы'],
  'ru/ekspertiza/strukturirovanie-gruppy.html': ['Когда структурирование группы — правильная точка входа', 'карта текущей модели'],
  'ru/ekspertiza/bankovskaya-gotovnost.html': ['Готовим структуру до того, как банк или платёжный провайдер', 'Что банк или платёжный провайдер должен быстро понять'],
  'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html': ['квалифицированный налоговый специалист', 'Какие факты меняют анализ налогового резидентства и КИК'],
  'ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html': ['Когда нужен системный аудит структуры', 'приоритетный план действий'],
  'ru/formaty-raboty/kak-nachat.html': ['Начинаем с минимально достаточного объёма', 'Не нужно заранее знать, какой формат вам нужен'],
  'ru/zaprosit-razbor.html': ['Что произойдёт после отправки', 'Карта ключевых вопросов', 'не для автоматического юридического или налогового заключения'],

  'uk/index.html': ['розрізнену транскордонну конструкцію', 'суттєві розриви'],
  'uk/ekspertyza/strukturuvannya-grupy.html': ['Коли структурування групи — правильна точка входу', 'карта поточної моделі'],
  'uk/ekspertyza/bankivska-gotovnist.html': ['Готуємо структуру до того, як банк або платіжний провайдер', 'Що банк або платіжний провайдер має швидко зрозуміти'],
  'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html': ['кваліфікований податковий фахівець', 'Які факти змінюють аналіз податкового резидентства та КІК'],
  'uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html': ['Коли потрібен системний аудит структури', 'пріоритетний план дій'],
  'uk/yak-pochaty.html': ['Починаємо з мінімально достатнього обсягу', 'Не потрібно заздалегідь знати, який формат вам потрібен'],
  'uk/zapytaty-rozbir.html': ['Що відбудеться після надсилання', 'Карта ключових питань', 'не для автоматичного юридичного чи податкового висновку']
};

for (const [rel, needles] of Object.entries(expected)) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  for (const needle of needles) if (!html.includes(needle)) failures.push(`${rel}: missing expected copy: ${needle}`);
}

const forbidden = {
  'en/index.html': ['We design international structures that withstand tax, banking, investment and regulatory scrutiny.'],
  'en/expertise/banking-readiness.html': ['this is almost never a technical problem'],
  'en/expertise/tax-residency-cfc.html': ['Residency is determined not by incorporation, but by effective management and control.'],
  'ru/ekspertiza/bankovskaya-gotovnost.html': ['это почти никогда не техническая проблема'],
  'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html': ['Резидентство определяется не регистрацией'],
  'uk/ekspertyza/bankivska-gotovnist.html': ['це майже ніколи не технічна проблема'],
  'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html': ['Резидентство визначається не реєстрацією']
};

for (const [rel, needles] of Object.entries(forbidden)) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const needle of needles) if (html.includes(needle)) failures.push(`${rel}: old high-friction/overbroad copy remains: ${needle}`);
}

for (const rel of ['en/request-review.html','ru/zaprosit-razbor.html','uk/zapytaty-rozbir.html']) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const count = (html.match(/class=["'][^"']*\bformat-card-home\b[^"']*["']/g) || []).length;
  if (count < 3) failures.push(`${rel}: expected at least 3 outcome cards, found ${count}`);
}

if (failures.length) {
  console.error(`[LEXONYX commercial entry QA] FAIL — ${failures.length} issue(s)`);
  for (const failure of failures) console.error(' - ' + failure);
  process.exit(1);
}

console.log(`[LEXONYX commercial entry QA] PASS — pages=${Object.keys(expected).length}; targeted entry-point copy verified across RU/EN/UK`);
