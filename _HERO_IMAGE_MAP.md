# LEXONYX — карта hero-изображений

Кладите файл в папку **`/assets/hero/`** с точным именем из колонки «файл» (формат `.webp`).
Одно изображение показывается на **всех трёх языках** страницы. Пусто → тёмный/светлый фон как раньше.

Заголовок слева → композиция: **объект справа, тёмное поле слева** (промты в `LEXONYX_HERO_PROMPTS.md`).

## Тёмные hero (белый заголовок)

| файл в /assets/hero/ | страница |
|---|---|
| `accessibility.webp` | Заявление о доступности |
| `dlya-ukrainskogo-biznesa.webp` | Для украинских предпринимателей и инвесторов в Европ |
| `ekspertiza-bankovskaya-gotovnost.webp` | Банковская готовность |
| `ekspertiza-index.webp` | Экспертиза международной модели бизнеса |
| `ekspertiza-nalogovoe-rezidentstvo-i-kik.webp` | Налоговое резидентство и КИК |
| `ekspertiza-pe-risk-i-mezhdunarodnye-komandy.webp` | Риск постоянного представительства и международные к |
| `ekspertiza-regulyatornaya-arhitektura-i-licenzirovanie.webp` | Регуляторная архитектура и лицензирование |
| `ekspertiza-source-of-funds.webp` | Происхождение средств, которое выдержит проверку |
| `ekspertiza-strukturirovanie-gruppy.webp` | Структурирование группы |
| `ekspertiza-substance-i-governance.webp` | Структура без substance — структурно беззащитна |
| `ekspertiza-vat-i-transgranichnye-modeli.webp` | VAT и трансграничные модели |
| `formaty-raboty-ekspress-proverka-riskov.webp` | Экспресс-проверка рисков |
| `formaty-raboty-index.webp` | Форматы работы |
| `formaty-raboty-soprovozhdenie-i-advisory.webp` | Сопровождение и advisory |
| `formaty-raboty-strategicheskiy-strukturnyy-audit.webp` | Стратегический структурный аудит |
| `index.webp` | Стратегическое структурирование международного бизне |
| `insayty-brifingi-playbook-group-architecture.webp` | Международное структурирование группы: |
| `insayty-index.webp` | Инсайты |
| `insayty-instrumenty-checklist-substance.webp` | Substance Readiness |
| `intake-intake.webp` | Запросить первичный разбор |
| `intake-ruspasibo.webp` | Запрос отправлен |
| `kontakty.webp` | Начать проект |
| `o-praktike-index.webp` | О практике |
| `o-praktike-kak-my-rabotaem.webp` | Как мы работаем |
| `o-praktike-kto-my.webp` | LEXONYX — практика про международную модель бизнеса |
| `podhod-index.webp` | Подход к международной модели бизнеса |
| `podhod-karta-riskov.webp` | Карта рисков международной структуры |
| `podhod-principy-mezhdunarodnyh-struktur.webp` | Принципы построения международных структур |
| `podhod-strukturnaya-model.webp` | Структурная модель международной группы |
| `ruspasibo-newsletter.webp` | Спасибо — подписка оформлена |
| `yurisdikcii-chehiya.webp` | Чехия для международного бизнеса |
| `yurisdikcii-es-index.webp` | Европейские юрисдикции в международной структуре биз |
| `yurisdikcii-estoniya.webp` | Эстония для международного бизнеса |
| `yurisdikcii-index.webp` | Юрисдикции для международного бизнеса |
| `yurisdikcii-irlandiya.webp` | Ирландия для международного бизнеса |
| `yurisdikcii-kipr.webp` | Кипр для международного бизнеса |
| `yurisdikcii-litva.webp` | Литва для международного бизнеса |
| `yurisdikcii-malta.webp` | Мальта для международного бизнеса |
| `yurisdikcii-niderlandy.webp` | Нидерланды для международного бизнеса |
| `yurisdikcii-oae.webp` | ОАЭ для международного бизнеса |
| `yurisdikcii-polsha.webp` | Польша для международного бизнеса |
| `yurisdikcii-shveycariya.webp` | Швейцария для международного бизнеса |
| `yurisdikcii-velikobritaniya.webp` | Великобритания для международного бизнеса |
| `zaprosit-razbor.webp` | Запросить разбор структуры |

## Светлые hero — подстраницы «Инсайтов» (тёмный заголовок)

| файл в /assets/hero/ | страница |
|---|---|
| `insayty-brifingi-index.webp` | Брифинги |
| `insayty-instrumenty-checklists.webp` | Checklists |
| `insayty-instrumenty-index.webp` | Инструменты |
| `insayty-razbory-deep-dive-banking-readiness.webp` | Banking Readiness |
| `insayty-razbory-deep-dive-cfc-residency.webp` | CFC и налоговое резидентство основателя |
| `insayty-razbory-deep-dive-holdco-opco.webp` | HoldCo / OpCo |
| `insayty-razbory-deep-dive-pe-remote.webp` | Permanent Establishment |
| `insayty-razbory-deep-dive-vat-architecture.webp` | VAT-архитектура для e-commerce и SaaS |
| `insayty-razbory-deep-dives.webp` | Deep Dive |
| `insayty-razbory-index.webp` | Разборы |

---

## Как пользоваться

1. Сгенерировали образ (промт для страницы — в `LEXONYX_HERO_PROMPTS.md`).
2. Сохраните как `<имя>.webp` из таблицы, положите в `/assets/hero/`.
3. Обновите страницу в Live Server — фон появится сам, с затемнением слева под заголовок.

**Формат:** `.webp` (лёгкий). Если удобнее `.jpg`/`.png` для быстрой примерки — скажите, переключу расширение во всём блоке одной правкой.
**Размер:** ширина ≥ 2560px, соотношение ~7:3 (обрежется по `cover`).
**Ничего не ломается, если файла нет** — hero просто останется тёмным/светлым как сейчас.

*Правки затемнения (сильнее/слабее, левее/правее) — в блоке `HERO BACKGROUND IMAGES` в `styles.css`. Скажите, если нужно подкрутить.*