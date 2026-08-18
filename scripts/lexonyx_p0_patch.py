from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_required(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise RuntimeError(f"Required pattern not found: {label}")
    return text.replace(old, new)


def patch_file(rel_path: str, replacements=None, simple_replacements=None):
    path = ROOT / rel_path
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new, label in replacements or []:
        text = replace_required(text, old, new, f"{rel_path}: {label}")
    for old, new in simple_replacements or []:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"patched {rel_path}")
    else:
        print(f"no changes {rel_path}")


# P0: Cyprus factual / SEO / schema corrections.
patch_file(
    "ru/yurisdikcii/kipr.html",
    replacements=[
        (
            "<title>Кипр: корпоративный налог 12,5%, холдинговые структуры и международное структурирование — LEXONYX</title>",
            "<title>Кипр для международного бизнеса: HoldCo, IP и корпоративные структуры — LEXONYX</title>",
            "Cyprus title",
        ),
        (
            'content="Кипр: корпоративный налог 12,5%, холдинговые структуры, IP Box, treaty use, substance и налоговое резидентство. Анализ применимости Кипра в международном структурировании бизнеса (EU context)."',
            'content="Кипр в международных корпоративных структурах: HoldCo, ownership, IP workstreams, substance, management и investor scenarios. LEXONYX оценивает необходимость кипрской компании как элемента общей cross-border архитектуры."',
            "Cyprus meta description",
        ),
        (
            'content="Когда Кипр релевантен для международной структуры: treaty use, substance и практическая применимость."',
            'content="Когда кипрская компания действительно нужна международной структуре: ownership, HoldCo, IP, substance, management и operational reality."',
            "Cyprus OG description",
        ),
        (
            '"url":"https://lexonyx.com/ru/cyprus.html"',
            '"url":"https://lexonyx.com/ru/yurisdikcii/kipr.html"',
            "Cyprus WebPage URL",
        ),
        (
            '"item":"https://lexonyx.com/ru/jurisdictions.html"',
            '"item":"https://lexonyx.com/ru/yurisdikcii/"',
            "Cyprus breadcrumb hub URL",
        ),
        (
            '"item":"https://lexonyx.com/ru/cyprus.html"',
            '"item":"https://lexonyx.com/ru/yurisdikcii/kipr.html"',
            "Cyprus breadcrumb page URL",
        ),
        (
            "Корпоративный налог на Кипре составляет 12,5%.",
            "С 2026 года стандартная ставка корпоративного налога на Кипре составляет 15%.",
            "Cyprus visible CIT",
        ),
        (
            "• Corporate Income Tax — 12,5%",
            "• Corporate Income Tax — 15% (с 2026 года)",
            "Cyprus parameter CIT",
        ),
    ],
    simple_replacements=[
        ("Когда Кипр релевантна", "Когда Кипр релевантен"),
        ("при выборе Кипр", "при выборе Кипра"),
        ("роль Кипр в структуре", "роль Кипра в структуре"),
        ("структура в Кипр", "структура на Кипре"),
        ("Кипр чаще релевантна", "Кипр чаще релевантен"),
    ],
)

# P0: Estonia factual / SEO / schema corrections.
patch_file(
    "ru/yurisdikcii/estoniya.html",
    replacements=[
        (
            "<title>Эстония: OÜ, 0% на нераспределённую прибыль и международное структурирование — LEXONYX</title>",
            "<title>Эстония для digital и remote business: OÜ, SaaS и международные структуры — LEXONYX</title>",
            "Estonia title",
        ),
        (
            'content="Эстония: OÜ, 0% налог на нераспределённую прибыль, дивидендный режим 20/80, e-residency, EU VAT, substance и management & control. Анализ применимости Эстонии для международного бизнеса."',
            'content="Эстония для digital, SaaS и remote business models: OÜ, e-Residency, distributed teams, management, substance и cross-border tax interfaces. Анализируем роль эстонской компании в общей структуре бизнеса."',
            "Estonia meta description",
        ),
        (
            'content="Когда Эстония релевантна для международной структуры: e-residency reality, digital governance, substance и практическая применимость."',
            'content="Когда Estonia OÜ подходит digital и remote business — и почему e-Residency сама по себе не определяет tax residence, substance или место управления."',
            "Estonia OG description",
        ),
        (
            '"url":"https://lexonyx.com/ru/estonia.html"',
            '"url":"https://lexonyx.com/ru/yurisdikcii/estoniya.html"',
            "Estonia WebPage URL",
        ),
        (
            '"item":"https://lexonyx.com/ru/jurisdictions.html"',
            '"item":"https://lexonyx.com/ru/yurisdikcii/"',
            "Estonia breadcrumb hub URL",
        ),
        (
            '"item":"https://lexonyx.com/ru/estonia.html"',
            '"item":"https://lexonyx.com/ru/yurisdikcii/estoniya.html"',
            "Estonia breadcrumb page URL",
        ),
    ],
    simple_replacements=[
        ("20/80", "22/78"),
        ("при выборе Эстония", "при выборе Эстонии"),
        ("роль Эстония в структуре", "роль Эстонии в структуре"),
        ("структура в Эстония", "структура в Эстонии"),
    ],
)

# P0: normalize legacy schema URLs on the remaining active RU jurisdiction pages.
legacy_to_canonical = {
    "ru/yurisdikcii/polsha.html": ("https://lexonyx.com/ru/poland.html", "https://lexonyx.com/ru/yurisdikcii/polsha.html"),
    "ru/yurisdikcii/niderlandy.html": ("https://lexonyx.com/ru/netherlands.html", "https://lexonyx.com/ru/yurisdikcii/niderlandy.html"),
    "ru/yurisdikcii/irlandiya.html": ("https://lexonyx.com/ru/irlandiya.html", "https://lexonyx.com/ru/yurisdikcii/irlandiya.html"),
    "ru/yurisdikcii/oae.html": ("https://lexonyx.com/ru/uae.html", "https://lexonyx.com/ru/yurisdikcii/oae.html"),
    "ru/yurisdikcii/velikobritaniya.html": ("https://lexonyx.com/ru/united-kingdom.html", "https://lexonyx.com/ru/yurisdikcii/velikobritaniya.html"),
    "ru/yurisdikcii/shveycariya.html": ("https://lexonyx.com/ru/switzerland.html", "https://lexonyx.com/ru/yurisdikcii/shveycariya.html"),
}
for rel_path, (legacy, canonical) in legacy_to_canonical.items():
    path = ROOT / rel_path
    if not path.exists():
        raise RuntimeError(f"Missing jurisdiction file: {rel_path}")
    text = path.read_text(encoding="utf-8")
    text2 = text.replace(legacy, canonical).replace("https://lexonyx.com/ru/jurisdictions.html", "https://lexonyx.com/ru/yurisdikcii/")
    if text2 != text:
        path.write_text(text2, encoding="utf-8")
        print(f"normalized schema URLs {rel_path}")

# Normalize the moved How to Start internal URL across RU HTML files.
for path in (ROOT / "ru").rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    text2 = text.replace('/ru/kak-nachat.html', '/ru/formaty-raboty/kak-nachat.html')
    if text2 != text:
        path.write_text(text2, encoding="utf-8")
        print(f"normalized How to Start URL {path.relative_to(ROOT)}")

# Remove the temporary runner files from the resulting commit.
for temp in [ROOT / "scripts/lexonyx_p0_patch.py", ROOT / ".github/workflows/lexonyx-p0.yml"]:
    if temp.exists():
        temp.unlink()
        print(f"removed temporary file {temp.relative_to(ROOT)}")
