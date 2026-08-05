#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LEXONYX — удаление дублирующего блока «Архитектурное ядро» на хабе «Экспертиза»
(ru/uk/en). Оставляем «Центр системы»: те же 7 элементов, но со ссылками.

ВАЖНО: якорь id="expertise-map" (на него ведёт кнопка «Смотреть систему» из hero)
переносится на секцию «Центр системы», чтобы кнопка продолжала работать.

Идемпотентно, сохраняет CRLF/LF.
Запуск: python3 remove_core_block.py [КОРЕНЬ] [--dry-run]
"""
import sys, re, pathlib

def find_section(text, marker):
    """Границы <section ...marker...> ... </section> с учётом вложенности."""
    m = re.search(r'<section[^>]*class="[^"]*' + marker + r'[^"]*"[^>]*>', text)
    if not m:
        return None, None
    start = m.start()
    pos = m.end()
    depth = 1
    while depth > 0:
        nxt = re.search(r'<section\b|</section>', text[pos:])
        if not nxt:
            return None, None
        if nxt.group(0) == '</section>':
            depth -= 1
        else:
            depth += 1
        pos += nxt.end()
    return start, pos

def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    args = [a for a in args if a != "--dry-run"]
    root = pathlib.Path(args[0]) if args else pathlib.Path(".")

    changed = 0
    rows = []
    for path in sorted(root.rglob("*.html")):
        raw = path.read_bytes()
        nl = "\r\n" if b"\r\n" in raw else "\n"
        text = raw.decode("utf-8", "replace").replace("\r\n", "\n")
        if "expertise-map" not in text or "expertise-center" not in text:
            continue
        s, e = find_section(text, "expertise-map")  # по КЛАССУ секции, не по id
        if s is None:
            rows.append((str(path.relative_to(root)), "секция не найдена")); continue
        removed = text[s:e]
        # вырезаем секцию (вместе с ведущими пробелами строки)
        line_start = text.rfind("\n", 0, s) + 1
        new = text[:line_start] + text[e:].lstrip("\n")
        # переносим якорь на «Центр системы», если его там ещё нет
        if 'id="expertise-map"' not in new:
            new = re.sub(r'(<section class="[^"]*expertise-center[^"]*")',
                         r'\1 id="expertise-map"', new, count=1)
        if new != text:
            changed += 1
            rows.append((str(path.relative_to(root)),
                         f"удалено {len(removed)} симв., якорь перенесён"))
            if not dry:
                path.write_bytes(new.replace("\n", nl).encode("utf-8"))
        else:
            rows.append((str(path.relative_to(root)), "уже без блока"))

    print("== Удаление дубля «Архитектурное ядро» ==" + (" (DRY-RUN)" if dry else ""))
    print(f"изменено файлов: {changed}")
    for f, st in rows:
        print(f"  {f}: {st}")

if __name__ == "__main__":
    main()
