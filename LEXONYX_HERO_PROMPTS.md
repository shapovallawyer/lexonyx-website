# LEXONYX — Midjourney-промты для hero-образов (ред. 2)

**Направление A — предметно-материальное:** тёмная каменная поверхность, один сдержанный объект или край, тёплая золотая кромка как акцент (не луч), большое пустое поле под заголовок. Тишина, материал, вес.

**Композиция (заголовок слева):** объект и золотой акцент — **справа**, вся **левая часть кадра — спокойное тёмное пустое поле** под заголовок. Никаких рассекающих диагоналей через центр, никакого мелкого «шума» (листья, крошки, царапины, растения).

**Отличие от прошлой версии:** ушли слова-триггеры «эпика» (`monumental, cinematic, weighty, shaft, colonnade, gateway, rising volumes`) — они давали концепт-арт и диагональные «разрезы». Теперь язык — «материал + предмет + пустота».

---

## 1. Визуальная ДНК (общая для всех страниц)

- **Материал:** тёмный сланец, базальт, необработанный камень, матовый бетон, тёмная штукатурка. Матовые фактуры, видимое зерно камня.
- **Объект:** ОДИН сдержанный элемент — гладкий камень, край каменной плиты, тёсаный блок, невысокая стопка плоских камней. Крупно, тактильно, спокойно.
- **Свет:** мягкий рассеянный направленный, low-key. Тёплый золотой блик только на **кромке** объекта. Без прожекторных лучей и бликов линзы.
- **Палитра:** глубокий сине-зелёный (teal-navy) фон, тёплое приглушённое золото `#b8956a` как единственный акцент. Приглушённо, не ярко.
- **Композиция:** объект справа, пустое тёмное поле слева; горизонт/плоскость низко; воздух вокруг объекта.
- **Настроение:** тишина, гравитация, точность, конфиденциальность.

### Технические параметры

В конец каждого промта:

```
--ar 7:3 --style raw --stylize 130
```

- `--ar 7:3` — широкий десктопный hero (как ваши тесты). Для мобильных догенерируйте `--ar 4:5` тем же промтом.
- `--style raw` — фотографическая строгость без глянца.
- `--stylize 130` — держит фотореализм. Диапазон 100–160; выше 180 не поднимать (уходит в «арт»).

### Негатив (ко всем)

```
--no people, faces, hands, text, letters, words, logos, watermark, brand names, flags,
megastructure, sci-fi, fantasy, concept art, epic, dramatic light beams, diagonal slash across frame,
bright colors, neon, glossy, plastic, 3d render look, cartoon, clutter,
leaves, plant, debris, food, insects, scratches, dust specks
```

### Универсальный «скелет»

> `[тёмная каменная поверхность] + [один объект/край справа] + [warm gold rim light on the edge] + vast empty dark space on the left for text, matte low-key lighting, muted teal-navy, fine stone grain, quiet, editorial, premium`

---

## 2. Промты по страницам

Технические параметры и негатив из раздела 1 добавляйте ко всем.

### Главная

**`index.html` — Стратегическое структурирование международного бизнеса**
> A single smooth stone resting on a dark slate slab, far to the right, warm gold light grazing its edge, vast empty dark teal-navy space on the left for text, matte low-key lighting, fine stone grain, quiet and considered, editorial, premium

---

### Подход (`/podhod/`)

**`podhod/index.html` — Подход к международной модели бизнеса**
> A single balanced stone on a dark stone surface, positioned right, soft warm gold rim light, large calm empty dark space on the left, matte low-key, muted teal-navy, restrained, quiet

**`podhod/principy-mezhdunarodnyh-struktur.html` — Принципы построения структур**
> A small deliberate stack of three flat stones resting on the right on a dark slate plane, stable and grounded, warm gold light on the top edge, empty dark space on the left, matte low-key, teal-navy, editorial

**`podhod/strukturnaya-model.html` — Структурная модель международной группы**
> A few smooth stones of different sizes arranged in quiet deliberate order on the right of a dark stone surface, one coherent set, soft warm gold edge light, empty dark field on the left, matte, teal-navy, restrained

**`podhod/karta-riskov.html` — Карта рисков международной структуры**
> A single dark stone with one fine natural fracture line catching a thin warm gold glint, resting right on a slate slab, tension held in stillness, empty dark space on the left, matte low-key, teal-navy, sober

---

### Экспертиза (`/ekspertiza/`)

**`ekspertiza/index.html` — Экспертиза международной модели бизнеса**
> A considered grouping of smooth stones of varied size on the right of a dark slate surface, a connected set, warm gold light along their edges, wide empty dark space on the left, matte low-key, teal-navy, editorial, premium

**`ekspertiza/strukturirovanie-gruppy.html` — Структурирование группы**
> Several stones of clearly different sizes placed in deliberate hierarchy on the right, dark stone surface, warm gold rim light, empty dark field on the left, matte, teal-navy, ordered, restrained

**`ekspertiza/nalogovoe-rezidentstvo-i-kik.html` — Налоговое резидентство и КИК**
> One heavy anchoring stone with a smaller stone beside it on the right of a dark slate slab, weight and where control rests, warm gold edge light, empty dark space on the left, matte low-key, teal-navy, sober

**`ekspertiza/vat-i-transgranichnye-modeli.html` — VAT и трансграничные модели**
> Two dark stones set on either side of a fine seam in a slate slab, right of frame, warm gold light tracing the seam, crossing a boundary, empty dark space on the left, matte, teal-navy, clean

**`ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html` — Риск постоянного представительства и международные команды**
> A few small stones spread at quiet distances across the right side of a dark stone surface, presence and footprint, faint warm gold edge light, empty dark field on the left, matte low-key, teal-navy

**`ekspertiza/bankovskaya-gotovnost.html` — Банковская готовность**
> A single upright stone standing at the edge of a dark slate slab on the right, a threshold to be met, warm gold light on its front edge, empty dark space on the left, matte low-key, teal-navy, sober

**`ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html` — Регуляторная архитектура и лицензирование**
> A single stone resting inside a shallow carved rectangular recess in a slate slab, right of frame, a defined boundary, warm gold light on the rim, empty dark space on the left, matte, teal-navy, precise

**`ekspertiza/substance-i-governance.html` — Substance и governance**
> One solid heavy stone with real visible depth resting firmly on a thick slate slab, right side, weight and genuine presence, warm gold light on the load-bearing edge, empty dark field on the left, matte low-key, teal-navy, grounded

**`ekspertiza/source-of-funds.html` — Происхождение средств, которое выдержит проверку**
> A stone showing clear natural layered strata from base to top, resting right on a dark slate surface, traceable depth, warm gold light reading the layers, empty dark space on the left, matte, teal-navy, sober

---

### Форматы работы (`/formaty-raboty/`)

**`formaty-raboty/index.html` — Форматы работы**
> Three stones of gradually increasing size in a quiet row on the right of a dark slate slab, depth of engagement, warm gold rim light, empty dark space on the left, matte low-key, teal-navy, ordered

**`formaty-raboty/strategicheskiy-strukturnyy-audit.html` — Стратегический структурный аудит**
> A single stone on a slate slab under soft even examining light revealing its full surface, right of frame, scrutiny and clarity, warm gold edge accent, empty dark space on the left, matte, teal-navy, precise

**`formaty-raboty/soprovozhdenie-i-advisory.html` — Сопровождение и advisory**
> A single stone resting on a long dark slate slab that recedes quietly to the right, steady continuity, soft warm gold edge light, wide empty dark space on the left, matte low-key, teal-navy, calm

**`formaty-raboty/ekspress-proverka-riskov.html` — Экспресс-проверка рисков**
> A single dark stone with one sharply lit edge on the right of a slate slab, quick focused read, thin warm gold accent, empty dark space on the left, matte low-key, teal-navy, minimal, alert

---

### Инсайты (`/insayty/`)

**`insayty/index.html` — Инсайты**
> A clean open dark slate surface with a single small stone resting far right, room for thought, soft warm gold edge light, large empty dark space on the left, matte low-key, teal-navy, editorial, calm

**`insayty/brifingi/index.html` — Брифинги**
> Two or three flat thin stone tablets stood upright in a quiet row on the right of a slate slab, concise and structured, warm gold light on the top edges, empty dark space on the left, matte, teal-navy, restrained

**`insayty/brifingi/playbook-group-architecture.html` — Playbook: структурирование группы**
> A flat slate tablet with a fine incised grid line catching warm gold, resting right, a systematic plan, empty dark space on the left, matte low-key, teal-navy, precise, editorial

**`insayty/razbory/index.html` — Разборы**
> A single stone split cleanly to reveal an ordered interior, resting right on a dark slate slab, analytical depth, warm gold light in the cut, empty dark space on the left, matte low-key, teal-navy, sober

**`insayty/razbory/deep-dives.html` — Deep Dive: архитектура международной структуры**
> A stone showing deep layered strata descending into shadow, resting right on a slate slab, going deeper, warm gold light marking the layers, empty dark space on the left, matte low-key, teal-navy, sober

**`insayty/razbory/deep-dive-holdco-opco.html` — HoldCo / OpCo**
> One flat stone resting cleanly on top of a broader flat stone, a clear two-tier relation, right of frame, warm gold light in the gap between them, empty dark space on the left, matte, teal-navy, restrained

**`insayty/razbory/deep-dive-cfc-residency.html` — CFC и резидентство основателя**
> A smaller stone set slightly apart from a heavier anchoring stone on the right of a slate slab, question of real control, faint warm gold edge light, empty dark space on the left, matte low-key, teal-navy, sober

**`insayty/razbory/deep-dive-pe-remote.html` — Permanent Establishment в remote-моделях**
> A few faint small stones scattered quietly across the right of a dark stone surface, distributed footprint, low warm gold edge light, empty dark space on the left, matte low-key, teal-navy

**`insayty/razbory/deep-dive-vat-architecture.html` — VAT-архитектура для e-commerce и SaaS**
> Two stones on either side of a fine routed channel in a slate slab, right of frame, cross-border flow, warm gold light following the channel, empty dark space on the left, matte, teal-navy, clean

**`insayty/razbory/deep-dive-banking-readiness.html` — Banking Readiness как стресс-тест**
> A solid stone resting firmly on a slate slab under raking light that tests its form, right side, stress test, warm gold on the sound edge, empty dark space on the left, matte low-key, teal-navy, sober

**`insayty/instrumenty/index.html` — Инструменты**
> A few precise flat stones laid out in measured order on the right of a dark slate surface, tools of assessment, warm gold edge light, empty dark space on the left, matte, teal-navy, restrained, editorial

**`insayty/instrumenty/checklists.html` — Checklists**
> A slate slab with a short ordered vertical sequence of shallow carved notches catching warm gold, resting right, systematic verification, empty dark space on the left, matte low-key, teal-navy, precise

**`insayty/instrumenty/checklist-substance.html` — Substance Readiness (чеклист)**
> One solid dense stone tested against light to show real depth versus hollow surface, resting right on a slate slab, genuine substance, warm gold edge light, empty dark space on the left, matte, teal-navy, grounded

---

### Юрисдикции (`/yurisdikcii/`)

Единый предметный язык, различие — **тон камня и характер света** (без флагов и достопримечательностей).

**`yurisdikcii/index.html` — Юрисдикции для международного бизнеса**
> A considered set of stones of clearly different tones and characters resting together on the right of a dark slate slab, each a distinct role, unifying warm gold edge light, wide empty dark space on the left, matte low-key, teal-navy, editorial, premium

**`yurisdikcii/kipr.html` — Кипр**
> A single warm pale limestone under clear bright Mediterranean light and clean shadow, resting right on a dark slate slab, sunlit calm, warm gold edge accent, empty dark space on the left, matte, teal-navy, restrained

**`yurisdikcii/malta.html` — Мальта**
> A dense honey-toned stone block under strong warm light, resting right on a slate slab, compact and fortified, gold edge accent, empty dark space on the left, matte low-key, teal-navy, sober

**`yurisdikcii/irlandiya.html` — Ирландия**
> A cool grey-green stone under soft diffuse northern light and faint mist, resting right on a dark slate slab, quiet resilience, subtle warm gold edge, empty dark space on the left, matte low-key, teal-navy, restrained

**`yurisdikcii/estoniya.html` — Эстония**
> A clean minimal stone with sharp precise edges under cool bright light, resting right on a slate slab, digital-era clarity, thin warm gold accent, empty dark space on the left, matte, teal-navy, spare, modern

**`yurisdikcii/litva.html` — Литва**
> A single upright ordered stone under measured cool light, resting right on a dark slate slab, steady and structured, warm gold edge accent, empty dark space on the left, matte low-key, teal-navy, calm

**`yurisdikcii/polsha.html` — Польша**
> A broad solid heavy stone mass under directional light, resting right on a slate slab, scale and momentum, warm gold light on the load edge, empty dark space on the left, matte low-key, teal-navy, weighty

**`yurisdikcii/chehiya.html` — Чехия**
> A layered stone with fine crafted detail under warm low light, resting right on a dark slate slab, established depth, warm gold edge accent, empty dark space on the left, matte, teal-navy, refined

**`yurisdikcii/niderlandy.html` — Нидерланды**
> A precise flat stone with clean level horizontals under cool even light, resting right on a slate slab, engineered order, thin warm gold accent, empty dark space on the left, matte, teal-navy, spare, exact

**`yurisdikcii/shveycariya.html` — Швейцария**
> A pale grey granite stone with crisp precise form under clean high-altitude light, resting right on a dark slate slab, discretion and permanence, restrained warm gold edge, empty dark space on the left, matte low-key, teal-navy, austere, premium

**`yurisdikcii/velikobritaniya.html` — Великобритания**
> A tall dark stone with deep vertical shadow under restrained grey-gold light, resting right on a slate slab, gravity and institution, warm gold edge accent, empty dark space on the left, matte low-key, teal-navy, sober

**`yurisdikcii/oae.html` — ОАЭ**
> A warm sandstone with sharp modern form under intense clear light, resting right on a dark slate slab, ambition held in restraint, warm gold edge accent, empty dark space on the left, matte low-key, teal-navy

**`yurisdikcii/es/index.html` — Европейские юрисдикции**
> A quiet set of pale-to-grey European stones resting together on the right of a dark slate slab, a shared framework, unifying warm gold edge light, empty dark space on the left, matte low-key, teal-navy, editorial

---

### О практике (`/o-praktike/`)

**`o-praktike/index.html` — О практике**
> A single refined stone under one considered soft light, resting right on a dark slate slab, focus and intent, warm gold edge accent, large empty dark space on the left, matte low-key, teal-navy, quiet, premium

**`o-praktike/kto-my.html` — LEXONYX: практика про международную модель**
> One solitary stone of quiet authority resting alone on the right of a dark slate slab, still and self-possessed, warm gold edge light, wide empty dark space on the left, matte low-key, teal-navy, weighty, restrained

**`o-praktike/kak-my-rabotaem.html` — Как мы работаем**
> An ordered sequence of stones stepping forward one by one across the right of a slate slab, method and process, progressive warm gold edge light, empty dark space on the left, matte, teal-navy, clear, calm

---

### Для украинского бизнеса

**`dlya-ukrainskogo-biznesa.html` — Для украинских предпринимателей и инвесторов в Европе**
> A single stone resting on a slate slab that reaches from shadow toward a stable softly lit surface on the right, passage and re-establishment, warm gold light ahead, empty dark space on the left, matte low-key, teal-navy, quiet hope

---

### Формы и служебные страницы

Образ тише — тихий фон под текст формы.

**`zaprosit-razbor.html` — Запросить разбор структуры**
> A single small stone at the clean edge of a dark slate slab on the right, an invitation to begin, soft warm gold edge light, large empty dark space on the left, matte low-key, teal-navy, minimal, calm

**`kontakty.html` — Начать проект**
> A single stone resting at a clean open edge of a slate slab on the right, a first step, warm gold edge accent, wide empty dark space on the left, matte low-key, teal-navy, minimal, spacious

**`intake/intake.html` — Запросить первичный разбор**
> A single quiet stone on a plain slate surface under soft even light, right of frame, space for a first conversation, faint warm gold edge, empty dark space on the left, matte low-key, teal-navy, restrained, minimal

**Страницы благодарности** (`intake/intake_thankyou.html`, `intake/ruspasibo.html`, `ruspasibo-newsletter.html`)
> A single stone on a slate slab in calm resolved soft light, right of frame, completion and acknowledgement, gentle warm gold edge, empty dark space on the left, matte low-key, teal-navy, serene, minimal

---

### Юридические страницы

`privacy-policy`, `cookie-policy`, `terms-of-use`, `accessibility` — отдельные объекты не нужны, одна общая нейтральная фактура:

> A close matte texture of dark slate with faint warm gold veining under low even light, no object, neutral and quiet, empty and calm, teal-navy tone, matte low-key, minimal --ar 7:3 --style raw --stylize 110

---

## 3. Практические заметки

- **Поле под заголовок.** Заголовок слева → объект справа, левые ⅔ кадра держите пустыми и тёмными. Если Midjourney смещает объект к центру — добавьте `object far right, not touching center, left two thirds empty`.
- **Правый край.** На десктопе справа сверху садятся меню/кнопка. Не поднимайте объект в самый правый верхний угол — держите его в правой нижней/центральной зоне (как удачный кадр с камнем).
- **Единство серии.** Генерируйте партиями по разделу — так проще держать единый тон камня и света. Выбивающийся по яркости кадр перегенерируйте.
- **Юрисдикции.** Отличие только тоном камня и характером света (тёплый/холодный, яркий/рассеянный). Форму объекта держите близкой, чтобы серия читалась как одно целое.
- **Против «шума».** Если лезут листья/крошки/царапины/растения — усильте негатив: `--no leaves, plant, debris, food, insects, scratches`.
- **Против диагоналей.** Если возвращается рассекающая кадр диагональ — добавьте `--no diagonal slash, strong diagonal line across frame` и просите `horizontal calm composition`.
- **Свет.** Золото — только тёплый блик на кромке объекта, не луч. Если свет становится «прожектором» — `soft diffuse light, no light beams, no spotlight`.
- **Апскейл.** Для десктопа ширина ≥ 2560px: Upscale (Subtle), при необходимости внешний апскейл. Сохранять в WebP (~80), JPG-исходники отдельно.
- **Затемнение под текст.** У hero уже есть тёмные CSS-оверлеи; если кадр светловат для белого заголовка — снизьте `--stylize` до 100 и добавьте `low-key, darker left side`.

---

*Каркас рабочий: `--stylize`, объект и тон камня можно подстраивать. ДНК из раздела 1 держит серию единой. Диагональные «разрезы» (прошлый вариант B) — только для 2–3 акцентных страниц по желанию, не как базовый паттерн.*
