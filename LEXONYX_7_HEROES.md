# LEXONYX — 7 hero-изображений (финальный бриф)

**Решение:** только 7 изображений — главная + шесть хабов разделов. Остальные 47 страниц остаются на тёмном градиенте с типографикой. Это не компромисс, а канон: «визуал — это тишина, текст — интеллект».

---

## Почему эта грамматика, а не комнаты

Сработал ровно один кадр — **камень крупно на сланце**. Не случайно: Midjourney силён в **простом контролируемом объекте крупным планом** и слаб в пустом пространстве (в его данных «пустая комната» почти не встречается — встречается «комната с цветами и мебелью», поэтому он их и подставлял).

Камень провалился **не как кадр, а как паттерн на 54 страницы**. Семь кадров, различающихся материалом, паттерном не станут: их семь, и каждый свой.

**Материалы выбраны из палитры серьёзного интерьера** — банк, кабинет, переплёт, chambers. Ни один не «спа»: дзен-ассоциацию давали именно гладкие окатанные камни, а не дерево, латунь и мрамор.

---

## Формула (та, что дала одобренный камень)

```
[материал крупно] + [его грань/кромка справа] + [мягкий тёплый свет вскользь] +
vast empty dark teal-navy space on the left for text + matte low-key lighting +
[фактура материала] + quiet and considered, editorial
```

**Параметры — те же, что на камне (проверено):**
```
--ar 7:3 --style raw --stylize 130
```

**Негатив** (сокращён до работающего; добавлено то, что реально лезло — комнаты, цветы, руины):
```
--no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers,
room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays,
lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product,
CGI, 3d render, illustration, concept art, epic, dramatic
```

⚠️ Слово `premium` в промт не писать — MJ выдаёт на него золото и глянец.

---

## Распределение материалов

| Файл | Раздел | Материал | Почему он |
|---|---|---|---|
| `index.webp` | **Главная** | камень на сланце | **готово, стоит** |
| `podhod-index.webp` | Подход | тёмный орех, волокно | направление волокна = метод, путь |
| `ekspertiza-index.webp` | Экспертиза | патинированная латунь | точность, ремесло, инструмент |
| `formaty-raboty-index.webp` | Форматы работы | хлопковая бумага слоями | форматы = документы, слои |
| `insayty-index.webp` | Инсайты | кромка толстого стекла | ясность, видеть насквозь |
| `yurisdikcii-index.webp` | Юрисдикции | тёмный мрамор с прожилками | один камень — разные прожилки = разные роли |
| `o-praktike-index.webp` | О практике | переплётная кожа, патина | время, рука, кабинет |

Единство держат: teal-navy, мягкий тёплый свет вскользь, матовость, объект справа / пустота слева, крупный план. Различие даёт **материал** — не сюжет.

---

## ШЕСТЬ ПРОМТОВ

*Вставлять одной строкой. Параметры и негатив — в конце каждого (уже вписаны).*

### Подход — тёмное дерево

```
A close detail of dark walnut wood with fine straight grain, its precisely cut edge on the right, soft warm light grazing along the grain, vast empty dark teal-navy space on the left for text, matte low-key lighting, deep wood tone, fine grain texture, quiet and considered, editorial --ar 7:3 --style raw --stylize 130 --no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers, room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays, lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product, CGI, 3d render, illustration, concept art, epic, dramatic
```

### Экспертиза — патинированная латунь

```
A close detail of aged patinated brass with a precise machined edge on the right, dark matte surface with no glare, soft warm light grazing the metal, vast empty dark teal-navy space on the left for text, matte low-key lighting, fine brushed texture, quiet and considered, editorial --ar 7:3 --style raw --stylize 130 --no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers, room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays, lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product, CGI, 3d render, illustration, concept art, epic, dramatic
```

### Форматы работы — бумага

```
A close detail of thick cotton paper sheets stacked in even layers, their cut edges on the right catching soft warm light, vast empty dark teal-navy space on the left for text, matte low-key lighting, fine paper fibre texture, quiet and considered, editorial --ar 7:3 --style raw --stylize 130 --no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers, room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays, lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product, CGI, 3d render, illustration, concept art, epic, dramatic
```

### Инсайты — кромка стекла

```
A close detail of a thick glass edge on the right, one thin line of soft warm light running along the polished edge, no sparkle, no rainbow, vast empty dark teal-navy space on the left for text, matte low-key lighting, deep clarity, quiet and considered, editorial --ar 7:3 --style raw --stylize 130 --no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers, room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays, lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product, CGI, 3d render, illustration, concept art, epic, dramatic
```

### Юрисдикции — мрамор с прожилками

```
A close detail of dark marble with fine pale veining running through it, its cut edge on the right, soft raking light revealing the veins, vast empty dark teal-navy space on the left for text, matte low-key lighting, fine stone grain, quiet and considered, editorial --ar 7:3 --style raw --stylize 130 --no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers, room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays, lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product, CGI, 3d render, illustration, concept art, epic, dramatic
```

### О практике — переплётная кожа

```
A close detail of dark bookbinding leather with natural grain and soft aged patina, worn matte surface, its folded edge on the right, soft warm light grazing the surface, vast empty dark teal-navy space on the left for text, matte low-key lighting, fine leather texture, quiet and considered, editorial --ar 7:3 --style raw --stylize 130 --no people, text, logos, watermark, spa, wellness, zen stones, pebbles, plants, flowers, room interior, furniture, ruins, decay, clutter, studio backdrop seam, spotlight, god rays, lens flare, HDR, oversaturated, glossy, ornate, gold decor, jewellery, handbag, fashion product, CGI, 3d render, illustration, concept art, epic, dramatic
```

---

## Отбор кадра — четыре вопроса

1. **Левые две трети — тёмные и спокойные?** Там ляжет заголовок.
2. **Материал читается на ощупь?** Видно волокно/патину/прожилку — не «пластик».
3. **Свет — вскользь, а не в лоб?** Никакого пятна-прожектора и бликов.
4. **Тепло — это оттенок света, а не золотая деталь в кадре?**

---

## Если что-то пойдёт не так

- **Латунь ушла в глянец/золотой декор** → добавить `dark oxidised brass, no polish, no shine`.
- **Стекло даёт блики/радугу** → добавить `frosted polished edge, no refraction`.
- **Мрамор стал «люксовой столешницей»** → `raw cut marble, unpolished, matte`.
- **Кожа стала сумкой** → `flat leather sheet, no stitching, no hardware, no object`.
- **Всё слишком тёплое, teal пропал** → в конце промта `cool teal-navy dominant, warm light only on the edge`.
- **Слишком «нарисованно»** → снизить `--stylize` до 100.

---

## Дальше

Прогнать шесть, показать. Что зайдёт — сохранить под именем из таблицы в `/assets/hero/`, оно подхватится само на всех трёх языках. Что не зайдёт — правим точечно по списку выше, материал на материал не меняем без нужды.

Файла нет → hero остаётся тёмным градиентом. Ничего не ломается, никакой спешки.
