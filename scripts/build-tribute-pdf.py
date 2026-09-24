#!/usr/bin/env python3
"""PDF книги для Tribute. HTML они не принимают."""

import io
import json
from pathlib import Path

from PIL import Image, ImageOps
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    CondPageBreak,
    Frame,
    FrameBreak,
    Image as RLImage,
    KeepTogether,
    ListFlowable,
    ListItem,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path("/workspace")
BOOK = json.loads((ROOT / "src/data/book.json").read_text())
PHOTOS = ROOT / "public/photos"
CACHE = ROOT / "artifacts/pdf-cache"
OUT = ROOT / "artifacts/timofey-bagrov-kniga.pdf"

INK = HexColor("#243028")
SOFT = HexColor("#3d4a42")
MUTED = HexColor("#6d7a72")
CLAY = HexColor("#b85a32")
LINE = HexColor("#e6dfd4")
CREAM = HexColor("#f7f3ec")
PAGE_W, PAGE_H = A4
LEFT = 16 * mm
RIGHT = 16 * mm
TOP = 14 * mm
BOTTOM = 16 * mm
CONTENT_W = PAGE_W - LEFT - RIGHT

pdfmetrics.registerFont(TTFont("Serif", "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Bold", "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans", "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"))


def esc(text: str) -> str:
    amp = "&" + "amp;"
    lt = "&" + "lt;"
    gt = "&" + "gt;"
    return text.replace("&", amp).replace("<", lt).replace(">", gt)


def jpeg(key: str, max_w: int, max_h: int, quality: int = 64) -> Path:
    src = PHOTOS / f"{key}.jpg"
    dest = CACHE / f"{key}-{max_w}x{max_h}-q{quality}.jpg"
    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
        return dest
    image = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    image.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, "JPEG", quality=quality, optimize=True)
    return dest


def picture(key: str, max_w: float, max_h: float, px_w: int, px_h: int) -> RLImage:
    path = jpeg(key, px_w, px_h)
    with Image.open(path) as image:
        width, height = image.size
    scale = min(max_w / width, max_h / height)
    return RLImage(str(path), width * scale, height * scale)


STYLES = {
    "cover_kicker": ParagraphStyle(
        "cover_kicker", fontName="Sans", fontSize=11, leading=14,
        textColor=CLAY, alignment=TA_CENTER, tracking=1,
    ),
    "cover_title": ParagraphStyle(
        "cover_title", fontName="Serif-Bold", fontSize=28, leading=32,
        textColor=INK, alignment=TA_CENTER,
    ),
    "cover_sub": ParagraphStyle(
        "cover_sub", fontName="Serif", fontSize=13, leading=18,
        textColor=SOFT, alignment=TA_CENTER,
    ),
    "h1": ParagraphStyle(
        "h1", fontName="Serif-Bold", fontSize=22, leading=26, textColor=INK,
    ),
    "h2": ParagraphStyle(
        "h2", fontName="Serif-Bold", fontSize=16, leading=20, textColor=INK,
    ),
    "body": ParagraphStyle(
        "body", fontName="Serif", fontSize=11, leading=15, textColor=SOFT,
    ),
    "small": ParagraphStyle(
        "small", fontName="Serif", fontSize=10, leading=14, textColor=SOFT,
    ),
    "label": ParagraphStyle(
        "label", fontName="Sans-Bold", fontSize=8, leading=11,
        textColor=CLAY, tracking=0.6,
    ),
    "kicker": ParagraphStyle(
        "kicker", fontName="Sans", fontSize=8.5, leading=11, textColor=MUTED,
    ),
    "recipe_title": ParagraphStyle(
        "recipe_title", fontName="Serif-Bold", fontSize=16, leading=20, textColor=INK,
    ),
    "toc_chapter": ParagraphStyle(
        "toc_chapter", fontName="Sans-Bold", fontSize=11, leading=14, textColor=INK,
    ),
    "toc_item": ParagraphStyle(
        "toc_item", fontName="Serif", fontSize=10, leading=13, textColor=SOFT,
    ),
    "footer": ParagraphStyle(
        "footer", fontName="Sans", fontSize=8, leading=10, textColor=MUTED,
    ),
}


class Bookmark(Spacer):
    def __init__(self, key: str, title: str, level: int):
        super().__init__(0, 0)
        self.key = key
        self.bm_title = title
        self.level = level

    def draw(self):
        self.canv.bookmarkPage(self.key)
        self.canv.addOutlineEntry(self.bm_title, self.key, self.level, 0)


def link(key: str, text: str) -> str:
    return f'<link href="#{key}" color="#243028">{esc(text)}</link>'


def field(label: str, body: str):
    return [
        Paragraph(esc(label).upper(), STYLES["label"]),
        Spacer(1, 1.5 * mm),
        Paragraph(esc(body), STYLES["body"]),
        Spacer(1, 3.2 * mm),
    ]


def recipe_block(recipe, section):
    practice = recipe.get("kind") == "practice"
    key = f"r{recipe['id']}"
    word = "Практика" if practice else "Рецепт"
    head = [
        Bookmark(key, f"{recipe['id']}. {recipe['title']}", 1),
        Paragraph(f'<a name="{key}"/>', STYLES["kicker"]),
        picture(recipe["image"], CONTENT_W, 58 * mm, 1100, 740),
        Spacer(1, 2.5 * mm),
        Paragraph(
            esc(f"Глава {section['roman']}. {section['title']}  ·  {word} {recipe['id']}"),
            STYLES["kicker"],
        ),
        Spacer(1, 1 * mm),
        Paragraph(esc(recipe["title"]), STYLES["recipe_title"]),
        Spacer(1, 3 * mm),
    ]
    body = [
        *field("Почему советую", recipe["benefit"]),
        *field("Что нужно" if practice else "Ингредиенты", recipe["ingredients"]),
        *field("Как делать" if practice else "Как приготовить", recipe["cook"]),
        *field("Когда и сколько" if practice else "Как принимать", recipe["take"]),
        *field("Противопоказания", recipe["contra"]),
    ]
    return head, body


def chapter_head(section, count):
    key = f"ch-{section['id']}"
    return KeepTogether([
        Bookmark(key, f"Глава {section['roman']}. {section['title']}", 0),
        Paragraph(f'<a name="{key}"/>', STYLES["kicker"]),
        Paragraph(esc(f"Глава {section['roman']}"), STYLES["kicker"]),
        Spacer(1, 1 * mm),
        Paragraph(esc(section["title"]), STYLES["h1"]),
        Spacer(1, 2 * mm),
        Paragraph(esc(section["intro"]), STYLES["body"]),
        Spacer(1, 1.5 * mm),
        Paragraph(esc(f"{count} {'практик' if section['id'] == 'vii' else 'рецептов'}"), STYLES["kicker"]),
        Spacer(1, 6 * mm),
    ])


def draw_page(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setFillColor(MUTED)
        canvas.setFont("Sans", 8)
        canvas.drawString(LEFT, 8 * mm, "Тимофей Багров")
        canvas.drawRightString(PAGE_W - RIGHT, 8 * mm, str(doc.page))
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.4)
        canvas.line(LEFT, 12 * mm, PAGE_W - RIGHT, 12 * mm)
    canvas.restoreState()


def build(pages: dict | None):
    sections = {s["id"]: s for s in BOOK["sections"]}
    by_section = {s["id"]: [] for s in BOOK["sections"]}
    for recipe in BOOK["recipes"]:
        by_section[recipe["section"]].append(recipe)

    story = []
    story.append(Bookmark("cover", "Обложка", 0))
    story.append(Spacer(1, 6 * mm))
    story.append(picture("cover", CONTENT_W, 115 * mm, 1400, 1000))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("ТИМОФЕЙ БАГРОВ", STYLES["cover_kicker"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("150 таёжных рецептов,<br/>которые работают", STYLES["cover_title"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(esc(BOOK["subtitle"]), STYLES["cover_sub"]))
    story.append(PageBreak())

    story.append(Bookmark("start", "Об этой книге", 0))
    story.append(Paragraph("Об этой книге", STYLES["h1"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        "Я собрал 150 проверенных временем рецептов из того, что всегда есть дома, "
        "в ближайшем супермаркете или на грядке у соседа. Это готовая система домашнего "
        "оздоровления без агрессивной химии, редкой экзотики и сложных аптечных сиропов.",
        STYLES["body"],
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Как читать", STYLES["h2"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "У каждого рецепта есть фото, список продуктов, шаги, как принимать и кому не стоит. "
        "Нажмите название в оглавлении — откроется нужный рецепт. "
        "В конце шесть коротких записей, если сейчас тяжело.",
        STYLES["body"],
    ))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Важно", STYLES["h2"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(esc(BOOK["disclaimer"]), STYLES["body"]))
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("Автор", STYLES["h2"]))
    story.append(Spacer(1, 2 * mm))
    author = picture("author", 42 * mm, 62 * mm, 700, 1100)
    author_text = [
        Paragraph("<b>Тимофей Багров</b>", STYLES["body"]),
        Spacer(1, 1.5 * mm),
        Paragraph("Экс-фельдшер скорой.", STYLES["small"]),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "Четыре года назад уехал с собакой Майей жить в тайгу — за сотни километров от цивилизации и аптек.",
            STYLES["small"],
        ),
        Spacer(1, 1.5 * mm),
        Paragraph(
            "Возрождаю и тестирую на себе методы выживания наших дедов. Делюсь тем, что работает.",
            STYLES["small"],
        ),
    ]
    story.append(Table(
        [[author, author_text]],
        colWidths=[46 * mm, CONTENT_W - 46 * mm],
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (0, 0), 4 * mm),
            ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]),
    ))
    story.append(PageBreak())

    story.append(Bookmark("toc", "Оглавление", 0))
    story.append(Paragraph('<a name="toc"/>', STYLES["kicker"]))
    story.append(Paragraph("Оглавление", STYLES["h1"]))
    story.append(Spacer(1, 4 * mm))

    def page_of(key: str) -> str:
        if not pages or key not in pages:
            return ""
        return str(pages[key])

    for section in BOOK["sections"]:
        recipes = by_section[section["id"]]
        head = link(f"ch-{section['id']}", f"Глава {section['roman']}. {section['title']}")
        story.append(Paragraph(head, STYLES["toc_chapter"]))
        story.append(Paragraph(esc(section["intro"]), STYLES["kicker"]))
        story.append(Spacer(1, 1.5 * mm))
        rows = []
        for recipe in recipes:
            word = "Практика" if recipe.get("kind") == "practice" else "Рецепт"
            title = link(f"r{recipe['id']}", f"{word} {recipe['id']}.  {recipe['title']}")
            rows.append([
                Paragraph(title, STYLES["toc_item"]),
                Paragraph(page_of(f"r{recipe['id']}"), STYLES["kicker"]),
            ])
        story.append(Table(
            rows,
            colWidths=[CONTENT_W - 14 * mm, 14 * mm],
            style=TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1.1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.1),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
            ]),
        ))
        story.append(Spacer(1, 3.5 * mm))

    story.append(Paragraph(link("notes", "Шесть записей в конце"), STYLES["toc_chapter"]))
    story.append(Spacer(1, 1 * mm))
    for note in BOOK["notes"]:
        story.append(Paragraph(
            link(f"n{note['id']}", f"Запись {note['id']}.  {note['title']}"),
            STYLES["toc_item"],
        ))
        story.append(Spacer(1, 0.8 * mm))
    story.append(PageBreak())

    for section in BOOK["sections"]:
        recipes = by_section[section["id"]]
        story.append(chapter_head(section, len(recipes)))
        for recipe in recipes:
            story.append(CondPageBreak(95 * mm))
            head, body = recipe_block(recipe, section)
            story.append(KeepTogether(head))
            story.extend(body)
            story.append(Spacer(1, 2 * mm))
        story.append(PageBreak())

    story.append(Bookmark("notes", "Шесть записей", 0))
    story.append(Paragraph('<a name="notes"/>', STYLES["kicker"]))
    story.append(Paragraph("Шесть записей", STYLES["h1"]))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph(
        "Если сейчас тяжело. Это не рецепты. Можно не читать.",
        STYLES["body"],
    ))
    story.append(Spacer(1, 5 * mm))
    for note in BOOK["notes"]:
        key = f"n{note['id']}"
        story.append(CondPageBreak(80 * mm))
        story.append(KeepTogether([
            Bookmark(key, f"Запись {note['id']}. {note['title']}", 1),
            Paragraph(f'<a name="{key}"/>', STYLES["kicker"]),
            picture(note["image"], CONTENT_W, 62 * mm, 1100, 800),
            Spacer(1, 2.5 * mm),
            Paragraph(esc(f"Запись {note['id']}"), STYLES["kicker"]),
            Spacer(1, 1 * mm),
            Paragraph(esc(note["title"]), STYLES["recipe_title"]),
            Spacer(1, 3 * mm),
        ]))
        for chunk in [c.strip() for c in note["body"].split("\n\n") if c.strip()]:
            story.append(Paragraph(esc(chunk).replace("\n", "<br/>"), STYLES["body"]))
            story.append(Spacer(1, 2.2 * mm))
        story.append(Spacer(1, 4 * mm))

    buf = io.BytesIO()
    doc = BaseDocTemplate(
        buf,
        pagesize=A4,
        title="150 таёжных рецептов, которые работают",
        author="Тимофей Багров",
        subject="Сборник домашних рецептов",
        pageCompression=1,
    )
    frame = Frame(LEFT, BOTTOM, CONTENT_W, PAGE_H - TOP - BOTTOM, showBoundary=0)
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=draw_page)])
    found = {}

    def after(flowable):
        if isinstance(flowable, Bookmark):
            found[flowable.key] = doc.page

    doc.afterFlowable = after
    doc.build(story)
    return buf.getvalue(), found


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    _, found = build(None)
    pdf, found2 = build(found)
    OUT.write_bytes(pdf)
    print(f"pages_mapped {len(found2)}")
    print(f"bytes {OUT.stat().st_size}")
    print(f"out {OUT}")
    # sanity: every recipe has a page
    missing = [r["id"] for r in BOOK["recipes"] if f"r{r['id']}" not in found2]
    print("missing_pages", missing)


if __name__ == "__main__":
    main()
