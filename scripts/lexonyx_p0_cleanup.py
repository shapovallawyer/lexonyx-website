from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def patch(rel_path, replacements):
    path = ROOT / rel_path
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print(f'patched {rel_path}')

patch('ru/yurisdikcii/kipr.html', [
    ('Где чаще всего возникают ограничения и риски в Кипр?', 'Где чаще всего возникают ограничения и риски на Кипре?'),
])

patch('ru/yurisdikcii/estoniya.html', [
    ('Где чаще всего возникают ограничения и риски в Эстония?', 'Где чаще всего возникают ограничения и риски в Эстонии?'),
])

patch('ru/impressum.html', [
    ('<meta name="description"\n    content="Условия использования сайта LEXONYX: характер информации, отсутствие отношений юрист-клиент, интеллектуальная собственность и ограничение ответственности.">',
     '<meta name="description"\n    content="Impressum LEXONYX: сведения о профессиональной практике, контакты, профессиональный статус и обязательная правовая информация.">'),
    ('<meta property="og:title" content="Условия использования — LEXONYX">', '<meta property="og:title" content="Impressum / Правовая информация — LEXONYX">'),
    ('<meta property="og:description"\n    content="Условия использования сайта LEXONYX: характер информации, отсутствие отношений юрист-клиент, интеллектуальная собственность и ограничение ответственности.">',
     '<meta property="og:description"\n    content="Impressum LEXONYX: сведения о профессиональной практике, контакты и обязательная правовая информация.">'),
    ('  <header class="site-header" id="main-header">\n    <header class="site-header" id="main-header" data-lang="ru">',
     '  <header class="site-header" id="main-header" data-lang="ru">'),
    ('\ni5\n', '\n'),
])

for temp in [ROOT / 'scripts/lexonyx_p0_cleanup.py', ROOT / '.github/workflows/lexonyx-p0-cleanup.yml']:
    if temp.exists():
        temp.unlink()
