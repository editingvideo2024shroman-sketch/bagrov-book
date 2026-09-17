import { book } from "@/lib/book";

function esc(s: string) {
  return s
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

function paras(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => `<p>${esc(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

async function blobToJpeg(blob: Blob, max = 960, quality = 0.72) {
  try {
    const bitmap = await createImageBitmap(blob);
    let w = bitmap.width;
    let h = bitmap.height;
    if (w > max) {
      h = Math.round((h * max) / w);
      w = max;
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => reject(fr.error);
      fr.readAsDataURL(blob);
    });
  }
}

async function loadPhotos() {
  const keys = new Set<string>(["cover"]);
  for (const r of book.recipes) keys.add(r.image);
  for (const n of book.notes) keys.add(n.image);
  const list = [...keys];
  const photos: Record<string, string> = {};
  const batch = 4;
  for (let i = 0; i < list.length; i += batch) {
    const slice = list.slice(i, i + batch);
    const got = await Promise.all(
      slice.map(async (key) => {
        try {
          const res = await fetch(`/photos/${key}.jpg`);
          if (!res.ok) return null;
          const data = await blobToJpeg(await res.blob());
          return [key, data] as const;
        } catch {
          return null;
        }
      }),
    );
    for (const row of got) if (row) photos[row[0]] = row[1];
  }
  return photos;
}

function img(photos: Record<string, string>, key: string, cls: string, alt: string) {
  const src = photos[key];
  if (!src) return "";
  return `<img class="${cls}" src="${src}" alt="${esc(alt)}">`;
}

function buildHtml(photos: Record<string, string>) {
  const tocChapters = book.sections
    .map((sec) => {
      const links = book.recipes
        .filter((r) => r.section === sec.id)
        .map(
          (r) =>
            `<a href="#r${r.id}"><span>${r.id}.</span><span>${esc(r.title)}</span></a>`,
        )
        .join("");
      return `<details class="ch">
        <summary><span class="arr">►</span><span>Глава ${esc(sec.roman)}. ${esc(sec.title)}</span></summary>
        <div class="list">${links}</div>
      </details>`;
    })
    .join("");

  const tocNotes = book.notes
    .map(
      (n) =>
        `<a href="#n${n.id}"><span>${n.id}.</span><span>${esc(n.title)}</span></a>`,
    )
    .join("");

  const recipes = book.recipes
    .map((r) => {
      const sec = book.sections.find((s) => s.id === r.section);
      const practice = r.kind === "practice";
      const prev = book.recipes.find((x) => x.id === r.id - 1);
      const next = book.recipes.find((x) => x.id === r.id + 1);
      const prevL = prev
        ? `<a class="nav-prev" href="#r${prev.id}">← Предыдущий рецепт</a>`
        : "<span></span>";
      const nextL = next
        ? `<a class="nav-next" href="#r${next.id}"><span><b>Далее</b><em>${esc(next.title)}</em></span> →</a>`
        : `<a class="nav-next" href="#n1"><span><b>Далее</b><em>к разговору</em></span> →</a>`;
      return `<article class="view" id="r${r.id}">
        <p class="kicker">Глава ${sec ? esc(sec.roman) : ""}. ${sec ? esc(sec.title) : ""}</p>
        ${img(photos, r.image, "shot", r.title)}
        <p class="kicker">${practice ? "Приём" : "Рецепт"} ${r.id}</p>
        <h1>${esc(r.title)}</h1>
        <div class="field"><b>Почему советую</b>${paras(r.benefit)}</div>
        <div class="field"><b>${practice ? "Что нужно" : "Ингредиенты"}</b>${paras(r.ingredients)}</div>
        <div class="field"><b>${practice ? "Как делать" : "Как приготовить"}</b>${paras(r.cook)}</div>
        <div class="field"><b>${practice ? "Когда и сколько" : "Как принимать"}</b>${paras(r.take)}</div>
        <div class="field"><b>Противопоказания</b>${paras(r.contra)}</div>
        <div class="nav">${prevL}${nextL}</div>
      </article>`;
    })
    .join("");

  const notes = book.notes
    .map((n) => {
      const prev = book.notes.find((x) => x.id === n.id - 1);
      const next = book.notes.find((x) => x.id === n.id + 1);
      const prevL = prev
        ? `<a class="nav-prev" href="#n${prev.id}">← Предыдущий рецепт</a>`
        : "<span></span>";
      const nextL = next
        ? `<a class="nav-next" href="#n${next.id}"><span><b>Далее</b><em>${esc(next.title)}</em></span> →</a>`
        : "<span></span>";
      return `<article class="view" id="n${n.id}">
        ${img(photos, n.image, "shot", n.title)}
        <p class="kicker">Запись ${n.id} из 6</p>
        <h1>${esc(n.title)}</h1>
        ${paras(n.body)}
        <div class="nav">${prevL}${nextL}</div>
      </article>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(book.title)} — ${esc(book.author)}</title>
<style>
:root{--paper:#efe8dc;--ink:#1a1410;--soft:#4a4138;--muted:#8a7f73;--line:#d4cbbd;--clay:#b45a32}
*{box-sizing:border-box}
html,body{margin:0;background:var(--paper);color:var(--ink);font:18px/1.5 Georgia,serif}
a{color:var(--clay);text-decoration:none}
.top{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:.75rem;height:3.5rem;padding:0 .9rem;border-bottom:1px solid var(--line);background:#efe8dcf5}
.top b{font-size:1.05rem}
.burger{display:none;color:var(--ink);font-size:1.25rem;padding:.2rem .4rem}
.scrim{display:none}
.layout{display:flex;min-height:calc(100svh - 3.5rem)}
.toc{width:20rem;flex-shrink:0;border-right:1px solid var(--line);padding:1rem 1rem 2rem;position:sticky;top:3.5rem;height:calc(100svh - 3.5rem);overflow:auto;background:var(--paper)}
.toc .ttl{display:block;font-size:1.15rem;color:var(--ink);margin:0 0 .8rem}
.ch{border-bottom:1px solid var(--line)}
.ch>summary{display:flex;gap:.5rem;padding:.75rem 0;cursor:pointer;list-style:none;color:var(--ink)}
.ch>summary::-webkit-details-marker{display:none}
.arr{display:inline-block;font-size:.7rem;margin-top:.25rem;transition:transform .2s}
.ch[open] .arr{transform:rotate(90deg)}
.list{display:flex;flex-direction:column;padding:0 0 .8rem 1.1rem}
.list a{display:grid;grid-template-columns:1.7rem 1fr;gap:.25rem;padding:.35rem 0;color:var(--soft);font:13px/1.3 system-ui,sans-serif}
.list a:hover{color:var(--clay)}
.main{flex:1;min-width:0;padding:2rem 1.5rem 4rem}
.page{max-width:40rem;margin:0 auto}
.view{display:none}
#home{display:block}
.view:target{display:block}
body:has(.view:target) #home:not(:target){display:none}
.cover{width:100%;max-width:22rem;display:block;margin:0 auto 1.25rem;border-radius:.6rem}
.shot{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:.5rem;background:#ddd3c4;margin:1rem 0}
.kicker{font:700 .7rem/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 .35rem}
h1{font-size:2.1rem;line-height:1.12;margin:.35rem 0 1rem}
.lead{color:var(--soft)}
.go{display:inline-block;margin-top:1.2rem;background:var(--clay);color:#fff;border-radius:.45rem;padding:.7rem 1.1rem}
.field{margin:1rem 0}
.field b{display:block;font:700 .7rem/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:.25rem}
.nav{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;align-items:stretch;margin-top:2rem;padding-top:1.2rem;border-top:1px solid var(--line)}
.nav-prev,.nav-next{border-radius:.5rem;padding:.75rem .85rem;text-decoration:none;font:600 14px/1.3 system-ui,sans-serif}
.nav-prev{display:flex;align-items:center;gap:.35rem;background:#c45a32;color:#fff}
.nav-next{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:.5rem;border:1px solid var(--line);background:#faf4ea;color:#c45a32}
.nav-next span{display:flex;flex-direction:column;color:inherit;min-width:0}
.nav-next b{font-weight:700}
.nav-next em{margin-top:.3rem;font-style:normal;font-weight:400;color:var(--ink);white-space:normal}
@media(max-width:860px){
  .burger{display:block}
  .toc{display:none;position:fixed;inset:3.5rem 0 0 auto;width:min(22rem,90vw);height:calc(100svh - 3.5rem);z-index:30;box-shadow:-8px 0 24px #0002}
  #toc:target{display:block}
  .scrim{position:fixed;inset:3.5rem 0 0;background:#0003;z-index:25}
  #toc:target ~ .scrim{display:block}
  .main{padding:1.25rem 1rem 3rem}
}
</style>
</head>
<body>
<header class="top">
  <a class="burger" href="#toc" aria-label="Оглавление">☰</a>
  <b>150 рецептов</b>
</header>
<div class="layout">
  <nav class="toc" id="toc">
    <a class="ttl" href="#home">Титул</a>
    ${tocChapters}
    <details class="ch">
      <summary><span class="arr">►</span><span>Разговор на важные темы</span></summary>
      <div class="list">${tocNotes}</div>
    </details>
  </nav>
  <a class="scrim" href="#home" aria-label="Закрыть"></a>
  <main class="main">
    <section class="page" id="home">
      ${img(photos, "cover", "cover", "Обложка")}
      <p class="kicker">${esc(book.author)}</p>
      <h1>${esc(book.title)}</h1>
      <p class="lead">150 рецептов из того, что всегда есть дома.</p>
      <a class="go" href="#r1">Начать с первого рецепта</a>
    </section>
    ${recipes}
    ${notes}
  </main>
</div>
</body>
</html>`;
}

export async function downloadBookFile() {
  const photos = await loadPhotos();
  const html = buildHtml(photos);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "150-taezhnyh-receptov.html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 8000);
}
