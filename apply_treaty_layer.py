#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LEXONYX — усиление treaty / anti-abuse слоя ВНУТРИ существующих карточек.
Новые секции и страницы не создаются. ATAD 3 не упоминается.

Правки (по одной карточке на страницу):
  Структурирование группы   -> «Налоговая логика, соглашения и антиабузные правила»
  Резидентство и КИК        -> «Доступ к соглашениям и антиабузные правила»
  Substance и governance    -> карточка 03 Risk assumption (+business purpose, BO)
  Стратегический аудит      -> карточка 04 Резидентство и КИК (+DTT/WHT/BO/PPT)
  + EN и UK эквиваленты, где файлы присутствуют.

Идемпотентно (маркер — наличие новой формулировки), сохраняет CRLF/LF.
Запуск: python3 apply_treaty_layer.py [КОРЕНЬ|ФАЙЛЫ...] [--dry-run]
"""
import sys, re, pathlib

def rx(s):
    """Точный текст -> whitespace-устойчивый регэксп."""
    return re.escape(s).replace(r"\ ", r"\s+").replace(r"\\n", r"\s+")

EDITS = [
    # ---------- RU: Структурирование группы ----------
    dict(
        marker="соглашения и антиабузные правила",
        old_h3="Налоговая логика и КИК",
        new_h3="Налоговая логика, соглашения и антиабузные правила",
        old_p="Как структура соотносится с резидентством собственников, правилами контроля и международной налоговой логикой.",
        new_p=("Как структура соотносится с резидентством собственников и правилами контроля: доступ к "
               "соглашениям об избежании двойного налогообложения (DTT), позиция по налогу у источника (WHT), "
               "фактическое право на доход (beneficial ownership), тест основной цели (PPT) с учётом MLI, "
               "общие антиуклонительные нормы (GAAR) и распределение прибыли между функциями, активами и "
               "рисками (transfer pricing)."),
    ),
    # ---------- RU: Резидентство и КИК ----------
    dict(
        marker="Доступ к соглашениям и антиабузные правила",
        old_h3="Договорная логика и доступ к соглашениям",
        new_h3="Доступ к соглашениям и антиабузные правила",
        old_p="Насколько структура согласована с сетью соглашений об избежании двойного налогообложения и не создаёт ли антиабузных рисков.",
        new_p=("Насколько структура согласована с сетью соглашений об избежании двойного налогообложения (DTT): "
               "ставки налога у источника (WHT), тест фактического права на доход (beneficial ownership), тест "
               "основной цели (PPT) с учётом изменений по MLI, применимые общие антиуклонительные нормы (GAAR) "
               "и деловая цель операций (business purpose)."),
    ),
    # ---------- RU: Substance и governance (карточка 03) ----------
    dict(
        marker="business purpose) и способность компании-получателя",
        old_p="Кто экономически несёт риски и совпадает ли это с формальной ролью entity внутри структуры.",
        new_p=("Кто экономически несёт риски и совпадает ли это с формальной ролью entity внутри структуры. "
               "Здесь же проверяется деловая цель операций (business purpose) и способность компании-получателя "
               "дохода пройти тест фактического права на доход (beneficial ownership)."),
    ),
    # ---------- RU: Стратегический аудит (карточка 04) ----------
    dict(
        marker="доступ к соглашениям (DTT), позиция по налогу у источника",
        old_p="Личное резидентство, тесты контроля, КИК, дивидендная логика и «перетекание» рисков на собственника.",
        new_p=("Личное резидентство, тесты контроля, КИК, дивидендная логика и «перетекание» рисков на "
               "собственника. Отдельно — доступ к соглашениям (DTT), позиция по налогу у источника (WHT), "
               "фактическое право на доход (beneficial ownership) и тест основной цели (PPT)."),
    ),
    # ---------- EN: Tax Residency and CFC ----------
    dict(
        marker="Treaty access and anti-abuse rules",
        old_h3="Treaty logic and treaty access",
        new_h3="Treaty access and anti-abuse rules",
        old_p="How far the structure is aligned with the double tax treaty network and whether it creates anti-abuse risks.",
        new_p=("How far the structure is aligned with the double tax treaty (DTT) network: withholding tax (WHT) "
               "positions, the beneficial ownership test, the principal purpose test (PPT) as modified by the MLI, "
               "any applicable general anti-avoidance rules (GAAR) and the business purpose of the transactions."),
    ),
    # ---------- EN: Substance and Governance (card 03) ----------
    dict(
        marker="business purpose of the transactions",
        old_p="Who economically assumes the risks, and whether this aligns with the formal role of the entity within the structure.",
        new_p=("Who economically assumes the risks, and whether this aligns with the formal role of the entity "
               "within the structure. This also tests the business purpose of the transactions and whether the "
               "recipient of income can satisfy the beneficial ownership test."),
    ),
    # ---------- UK: Стратегічний структурний аудит (картка 04) ----------
    dict(
        marker="доступ до угод (DTT)",
        old_p="Особисте резидентство, тести контролю, КІК, дивідендна логіка і «перетікання» ризиків на власника.",
        new_p=("Особисте резидентство, тести контролю, КІК, дивідендна логіка і «перетікання» ризиків на власника. "
               "Окремо — доступ до угод про уникнення подвійного оподаткування (DTT), позиція щодо податку на "
               "репатріацію (WHT), фактичне право на дохід (beneficial ownership) і тест основної мети (PPT)."),
    ),
    # ---------- UK: Структурування групи (якщо файл є) ----------
    dict(
        marker="угоди та антизловживальні правила",
        old_h3="Податкова логіка і КІК",
        new_h3="Податкова логіка, угоди та антизловживальні правила",
        old_p="Як структура співвідноситься з резидентством власників, правилами контролю і міжнародною податковою логікою.",
        new_p=("Як структура співвідноситься з резидентством власників і правилами контролю: доступ до угод про "
               "уникнення подвійного оподаткування (DTT), позиція щодо податку на репатріацію (WHT), фактичне "
               "право на дохід (beneficial ownership), тест основної мети (PPT) з урахуванням MLI, загальні "
               "антизловживальні норми (GAAR) і розподіл прибутку між функціями, активами та ризиками "
               "(transfer pricing)."),
    ),
    # ---------- UK: Податкове резидентство і КІК ----------
    dict(
        marker="Доступ до угод та антизловживальні правила",
        old_h3="Договірна логіка і доступ до угод",
        new_h3="Доступ до угод та антизловживальні правила",
        old_p="Наскільки структура узгоджена з мережею угод про уникнення подвійного оподаткування і чи не створює антиабузних ризиків.",
        new_p=("Наскільки структура узгоджена з мережею угод про уникнення подвійного оподаткування (DTT): "
               "ставки податку на репатріацію (WHT), тест фактичного права на дохід (beneficial ownership), "
               "тест основної мети (PPT) з урахуванням змін за MLI, застосовні загальні антизловживальні "
               "норми (GAAR) і ділова мета операцій (business purpose)."),
    ),
    # ---------- UK: Substance та governance (картка 03) ----------
    dict(
        marker="ділова мета операцій (business purpose) і здатність",
        old_p="Хто економічно несе ризики і чи збігається це з формальною роллю entity всередині структури.",
        new_p=("Хто економічно несе ризики і чи збігається це з формальною роллю entity всередині структури. "
               "Тут же перевіряється ділова мета операцій (business purpose) і здатність компанії-одержувача "
               "доходу пройти тест фактичного права на дохід (beneficial ownership)."),
    ),
    # ---------- EN: Strategic Structural Audit (card 04) ----------
    dict(
        marker="treaty access (DTT), the withholding tax",
        old_p="Personal tax residency, control tests, CFC, dividend logic and the \u201cspillover\u201d of risks to the owner.",
        new_p=("Personal tax residency, control tests, CFC, dividend logic and the \u201cspillover\u201d of risks to "
               "the owner. Separately \u2014 treaty access (DTT), the withholding tax (WHT) position, beneficial "
               "ownership and the principal purpose test (PPT)."),
    ),
]


def apply_edits(text):
    applied = []
    for e in EDITS:
        if e["marker"] in text:
            continue                                   # уже применено
        new = text
        if "old_h3" in e:
            pat = r"(<h3[^>]*>)\s*" + rx(e["old_h3"]) + r"\s*(</h3>)"
            if not re.search(pat, new):
                continue
            new = re.sub(pat, lambda m: m.group(1) + e["new_h3"] + m.group(2), new, count=1)
        pat_p = r"(<p[^>]*>)\s*" + rx(e["old_p"]) + r"\s*(</p>)"
        if not re.search(pat_p, new):
            continue
        new = re.sub(pat_p, lambda m: m.group(1) + e["new_p"] + m.group(2), new, count=1)
        text = new
        applied.append(e.get("new_h3") or e["marker"][:40])
    return text, applied


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry = "--dry-run" in sys.argv
    targets = []
    for a in args:
        p = pathlib.Path(a)
        targets.extend(sorted(p.rglob("*.html")) if p.is_dir() else [p])
    if not targets:
        targets = sorted(pathlib.Path(".").rglob("*.html"))

    total = 0
    for path in targets:
        raw = path.read_bytes()
        nl = "\r\n" if b"\r\n" in raw else "\n"
        text = raw.decode("utf-8", "replace").replace("\r\n", "\n")
        new, applied = apply_edits(text)
        if applied:
            total += 1
            print(f"  {path.name}: {', '.join(applied)}")
            if not dry:
                path.write_bytes(new.replace("\n", nl).encode("utf-8"))
    print(f"\n== Treaty / anti-abuse слой ==" + (" (DRY-RUN)" if dry else ""))
    print(f"файлов изменено: {total}")


if __name__ == "__main__":
    main()
