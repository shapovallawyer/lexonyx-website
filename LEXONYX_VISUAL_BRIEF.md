# LEXONYX — визуальный бриф для hero-изображений

*Этот документ отвечает на один вопрос: **что снимать и какими словами это описывать**, чтобы Midjourney выдал язык премиальной международной юридической практики.*

---

## 1. ДИАГНОЗ: почему провалились все пять прошлых заходов

Одна причина на всех:

> **Мы описывали ПРЕДМЕТ. Нужно описывать МЕСТО И СВЕТ.**

| Что описывали | Что получили | Почему |
|---|---|---|
| Предмет на поверхности (камень на плите) | Спа, велнес, каталог | Это грамматика **продуктовой съёмки**: объект на подиуме, бесшовный фон, нет воздуха |
| Символ (весы) | Клише юрфирмы | Буквальность |
| Абстракция (частицы, потоки) | Финтех/крипта | Язык другой индустрии |
| Абстрактная геометрия (`monumental volumes`) | Концепт-арт Artstation | Слова из лексикона цифровой иллюстрации |
| Фактура крупно (мрамор + латунь) | Каталог плитки | Свотч без пространства |

**Ключ:** дело не в том, ЧТО за объект. Дело в том, что объект на поверхности — это всегда «товар». Смените камень на папку, чашу, мрамор — грамматика останется продуктовой, и ощущение спа/каталога никуда не денется.

---

## 2. ДУХ: что такое премиальный визуал юридической практики

Посмотрите, как выглядят швейцарский приват-банк, Hermès, Aesop, журналы Kinfolk и Cereal. У них общее одно, и это **не предметы**:

> **Реальное пространство, в котором никого нет, снятое при естественном свете в конкретный час.**

Почему это работает именно для вашей практики:
- **Пространство подразумевает вас.** Пустая комната — это не «вещь, на которую смотрят», а «место, где мог бы быть ты». Это приглашение, а не витрина.
- **Пустота = конфиденциальность.** Комната, где принимают серьёзные решения, — сейчас пустая. Это ровно ваша интонация: тишина, приватность, вес.
- **Свет из окна = подлинность.** Студийный свет всегда читается как постановка/реклама. Дневной свет читается как «это место существует».
- **Архитектура = структура.** Ваша практика про структуры, которые держатся. Построенное пространство — честная метафора, а не символ.

**Формула духа:** пустая продуманная комната на рассвете. Никого. Свет из окна лёг на стену. Пыль в воздухе. Кто-то только что вышел или вот-вот войдёт.

Это **не** «монументальная архитектура» (это был заход №1 — эпик и концепт-арт). Это **тихая обжитая архитектура** в масштабе человека.

---

## 3. ГРАММАТИКА ПРОМТА: слова решают всё

Midjourney отвечает **на регистр языка**, а не на смысл. Напишете лексикой цифровой иллюстрации — получите иллюстрацию. Напишете лексикой фотографа — получите фотографию. Это главный рычаг.

### ⛔ СЛОВА-ЯД (вызывают провал)

**Вызывают концепт-арт:**
`monumental, epic, cinematic, dramatic, majestic, striking, powerful, abstract, geometric forms, volumes, minimal composition`

**Вызывают прожектор и драму света:**
`shaft of light, beam, ray, glow, radiant, luminous, ethereal, chiaroscuro`

**Вызывают продуктовую съёмку (это и был камень!):**
`resting on, placed on, arranged, composition of, single object, on a slab, on a surface, still life`

**Вызывают спа/велнес:**
`stone, pebble, zen, balance, harmony, serene, tranquil, meditative`

**Вызывают дешёвый люкс:** ⚠️ важно
`premium, luxury, elegant, sophisticated, opulent`
→ MJ понимает эти слова буквально: даёт **золото, глянец, ornament, гламур**. Премиальность достигается **фотографической сдержанностью**, а не словом «premium». Никогда не пишите его в промт.

### ✅ СЛОВА-ЛЕКАРСТВО (вызывают нужное)

**Место (вместо предмета):**
`empty room, interior, corridor, wall, floor, ceiling, window, threshold, courtyard, passage`

**Свет (вместо луча):**
`daylight, morning light, north light, overcast light, soft daylight from a window out of frame, natural light only, 7am, late afternoon`

**Камера (это включает фоторежим):**
`shot on large format film, medium format, Kodak Portra 400, film grain, natural light only`

**Жанр:**
`architectural interior photography, architectural photography, documentary, editorial`

**Настроение (вместо «premium»):**
`unoccupied, nobody present, still, quiet, calm, considered`

**Воздух:**
`fine dust suspended in still air, deep shadow, depth`

---

## 4. ФОРМУЛА

```
[тип пространства] + [архитектурная деталь: стена/пол/окно] +
[источник света + час] + [где свет ложится — СПРАВА] +
[глубокая тень слева две трети] + [палитра] +
[плёнка/формат] + natural light only + [жанр] + [unoccupied, still]
```

**Технические параметры (все страницы):**
```
--ar 7:3 --style raw --stylize 180
```

**Негатив (все страницы):**
```
--no people, faces, hands, text, letters, logos, watermark, flags, product,
object on pedestal, stone on slab, pebbles, zen stones, spa, wellness, still life,
scales of justice, gavel, skyscraper, particles, network, data, studio backdrop,
spotlight, light beams, god rays, lens flare, HDR, oversaturated, glossy, ornate,
gold decor, CGI, 3d render, illustration, concept art, epic, dramatic, plants, clutter
```

⚠️ **Не называйте фамилии фотографов** в промтах (частая практика, но для коммерческого сайта это спорно по правам, и MJ понимает их ненадёжно). Описывайте **качества и технику** — работает лучше.

---

## 5. КАК ДЕРЖАТЬ ЕДИНСТВО БЕЗ ОДНООБРАЗИЯ

Прошлая ошибка: единство искали через **повторение объекта** → 54 камня.

**Правильно:**

| Держим неизменным (даёт серию) | Меняем (даёт разнообразие) |
|---|---|
| Палитра: teal-navy тень + тёплый дневной свет | **Тип пространства** (комната → коридор → двор → деталь стены) |
| Свет: один естественный источник, low-key | **Дистанция** (общий план → средний → деталь) |
| Композиция: масса справа, воздух слева | **Час и погода** (рассвет, пасмурный полдень, вечер) |
| Плёночный фотореализм, зерно | **Материал** (камень, штукатурка, бетон, дерево, стекло) |
| Пусто, никого | |

### Семейства по разделам

| Раздел | Пространство | Дистанция |
|---|---|---|
| **Главная** | пустая модернистская комната, стена + пол, рассвет | общий план |
| **Подход** | коридор, проём, свет из-за угла | средний, уходящий вглубь |
| **Экспертиза (8)** | стык материалов в реальной комнате — у каждой темы свой материал | ближний, но **с воздухом** |
| **Форматы работы** | угол тихой комнаты, у окна | средний |
| **Инсайты** | кабинет: полка, бумага, окно (осторожно — не «библиотека-клише») | средний/ближний |
| **Юрисдикции (12)** | деталь фасада/двора — **различие по камню и свету страны** | средний |
| **О практике** | одна комната, окно, утренний свет | средний, интимный |

**Юрисдикции — здесь честное различие без флагов:** архитектура и свет стран реально разные. Кипр — бледный известняк, жёсткое средиземноморское солнце, резкая тень. Швейцария — точный серый гранит, холодная альпийская ясность. Нидерланды — кирпич и стекло, плоский северный свет. ОАЭ — светлый бетон, горячая дымка. Великобритания — тёмный камень, серый сдержанный свет.

---

## 6. ШЕСТЬ ПРОМТОВ НА ТЕСТ

*Прогнать эти, прежде чем писать все 54. Ко всем добавить параметры и негатив из §4.*

**Главная**
```
Empty modernist room at dawn, a dark stone wall meeting a smooth concrete floor,
soft daylight entering from a tall window out of frame on the right, one long calm
rectangle of warm morning light lying across the floor on the right, fine dust
suspended in still air, deep quiet shadow filling the left two thirds of the frame,
muted teal-navy greys with warm amber daylight, shot on large format film,
Kodak Portra 400, natural light only, architectural interior photography,
unoccupied, still, editorial
```

**Подход**
```
A long empty corridor in a modernist building, dark plaster walls, soft north daylight
from a window at the far right end, the passage receding into calm shadow on the left,
no furniture, nobody present, muted teal-navy with a warm daylight cast, shot on medium
format film, film grain, natural light only, architectural photography, quiet, still, documentary
```

**Экспертиза → substance и governance**
```
Close view of a dark stone wall meeting a concrete floor in an empty room, the
load-bearing junction visible, low raking afternoon daylight from the right revealing
the texture of both surfaces, deep shadow across the left two thirds, muted teal-navy
with a faint warm cast, shot on medium format film, natural light only,
architectural detail photography, unoccupied, still
```

**Юрисдикции → Швейцария**
```
Detail of a pale grey granite building wall with precise clean joints, seen across an
empty courtyard, crisp cool alpine daylight from the right, deep shadow filling the left
two thirds, muted teal-navy shadow with a restrained warm daylight cast, shot on large
format film, natural light only, architectural photography, austere, unoccupied, still
```

**О практике**
```
An empty quiet room with a single tall window on the right, soft morning daylight falling
across a dark plaster wall, an empty wooden chair just visible at the right edge, deep calm
shadow across the left two thirds, muted teal-navy with warm amber light, shot on medium
format film, natural light only, interior photography, nobody present, still, contemplative
```

**Инсайты**
```
A dark wooden shelf of closed books seen at an angle in a quiet unoccupied study, soft
overcast daylight from a window on the right grazing the edges of the pages, deep shadow
filling the left two thirds, muted teal-navy with a warm paper tone, shot on medium format
film, natural light only, interior detail photography, still, unoccupied
```

---

## 7. ДИАГНОСТИКА: как понять, что кадр правильный

Прогоните кадр по шести вопросам. **Любое «нет» — перегенерировать.**

1. **Чувствуется ли размер пространства?** Есть потолок, пол, стена, масштаб? → Если нет — это продуктовая съёмка.
2. **Есть ли воздух между планами?** Передний, средний, дальний? → Если нет — это свотч/фактура.
3. **Похоже, что свет пришёл из окна в конкретный час?** → Если это ровный студийный или прожектор — постановка, брак.
4. **Работал бы кадр как фотография в журнале, без текста поверх?** → Если он «пустой без заголовка» — это баннер, не hero.
5. **Похоже, что тут никого нет — или что тут расставили реквизит?** → Постановка = сток.
6. **Золото — это температура света, а не предмет?** → Если в кадре «золотая штука» — брак. Золото должно быть **тёплым оттенком дневного света**, а не объектом.

Плюс проверка под макет: **левые две трети — спокойные и тёмные** (там ляжет заголовок), масса и свет — справа.

---

## 8. ЧТО ДЕЛАТЬ НОВОМУ ЧАТУ

1. Прочитать §1–§3 — это суть. Особенно **слова-яд** и то, что `premium` в промте даёт обратный эффект.
2. **Не писать 54 промта сразу.** Сначала я прогоняю шесть тестовых из §6.
3. Я показываю результат → калибруем формулировки.
4. Только после моего «да» — полный документ на 54 промта по семействам из §5.
5. Одобренный кадр главной (камень на сланце) — **оставляем как есть, единственным**, если новая система не даст лучше. Он уже стоит как `index.webp`.

---

*Суть на одной строке: **снимаем не предмет, а пустую комнату, в которую падает утренний свет.***
