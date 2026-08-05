#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LEXONYX — синхронизация числа элементов системы на хабе «Экспертиза» (ru/uk/en).

ФАКТ берётся со страницы: считаются пронумерованные элементы системы
(architecture-number 01..N в блоке «Архитектурное ядро»).

Приводятся к этому числу ДВА заявления:
  1) строка в hero:      «N элементов / N елементів / N elements»
  2) заголовок ядра:     «Система из N взаимосвязанных элементов» и аналоги

Подзаголовок («Семь элементов…») и FAQ («из семи…») уже корректны — не трогаются.
Идемпотентно, сохраняет CRLF/LF. Больше ничего не меняет.

Запуск: python3 fix_expertise_count.py [КОРЕНЬ] [--dry-run]
"""
import sys, re, pathlib

WORD = {
    "ru": lambda n: "элемент" if n % 10 == 1 and n % 100 != 11 else ("элемента" if n % 10 in (2,3,4) and n % 100 not in (12,13,14) else "элементов"),
    "uk": lambda n: "елемент" if n % 10 == 1 and n % 100 != 11 else ("елементи" if n % 10 in (2,3,4) and n % 100 not in (12,13,14) else "елементів"),
    "en": lambda n: "element" if n == 1 else "elements",
}

# заголовок ядра: (регэксп с группами до/после числа)
HEAD = {
    "ru": r'(Система из\s*)(\d+)(\s*взаимосвязанны\w*\s*элемент\w*)',
    "uk": r'(Система з\s*)(\d+)(\s*взаємопов[’\']язани\w*\s*елемент\w*)',
    "en": r'(A system of\s*)(\d+)(\s*interconnected\s*elements?)',
}
HERO = {
    "ru": r'(>\s*)(\d+)(\s*элемент\w*\s*<)',
    "uk": r'(>\s*)(\d+)(\s*елемент\w*\s*<)',
    "en": r'(>\s*)(\d+)(\s*elements?\s*<)',
}

def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    args = [a for a in args if a != "--dry-run"]
    root = pathlib.Path(args[0]) if args else pathlib.Path(".")

    files = sorted(root.rglob("*.html"))
    rows, changed = [], 0
    for path in files:
        raw = path.read_bytes()
        nl = "\r\n" if b"\r\n" in raw else "\n"
        text = raw.decode("utf-8", "replace").replace("\r\n", "\n")
        lm = re.search(r'<html lang="([a-z]{2})"', text)
        lang = lm.group(1) if lm else None
        if lang not in WORD:
            continue
        n = len(re.findall(r'architecture-number', text))
        if n == 0:
            continue                       # не хаб экспертизы
        word = WORD[lang](n)
        before = text

        def fix_hero(m):
            return m.group(1) + str(n) + " " + word + m.group(3)[-1]
        text = re.sub(HERO[lang], lambda m: m.group(1) + str(n) + " " + word + "<", text)
        text = re.sub(HEAD[lang], lambda m: m.group(1) + str(n) + m.group(3), text)

        claims = re.findall(r'(?i)(\d+)\s*(?:взаимосвязанны\w*\s*)?(?:взаємопов\S*\s*)?(?:interconnected\s*)?(?:элемент\w*|елемент\w*|elements?)', before)
        rows.append((str(path.relative_to(root)), lang, sorted(set(claims)), n, "исправлено" if text != before else "уже верно"))
        if text != before:
            changed += 1
            if not dry:
                path.write_bytes(text.replace("\n", nl).encode("utf-8"))

    print("== Число элементов системы (хаб «Экспертиза») ==" + (" (DRY-RUN)" if dry else ""))
    print(f"HTML: {len(files)} | изменено: {changed}")
    for f, l, claims, n, st in rows:
        print(f"  [{l}] {f}: было заявлено {claims} -> фактически {n}  ({st})")

if __name__ == "__main__":
    main()
