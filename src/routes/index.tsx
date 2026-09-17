import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { BookCover } from "@/components/book-cover";
import { BuyDialog } from "@/components/buy-dialog";
import { RecipeSpread } from "@/components/recipe-block";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SAMPLE_IDS, book, photo, recipeById } from "@/lib/book";
import { usePurchase } from "@/lib/purchase";
import { SalePrice } from "@/components/sale-price";

export const Route = createFileRoute("/")({ component: Home });

const FOR_WHOM = [
  {
    title: "Вы проснулись уже уставшим",
    body: "Когда нет сил на самые простые действия, голова «чугунная», а внутри абсолютное опустошение. Вам нужно готовое и быстрое решение прямо на сегодня.",
  },
  {
    title: "Вы чувствуете, что заболеваете",
    body: "Горло першит, тело ломит, а на календаре вечер и до ближайшей аптеки не добраться.",
  },
  {
    title: "Ваш желудок бунтует после еды",
    body: "Вы регулярно сталкиваетесь с тяжестью, изжогой, вздутием или нерегулярным стулом и хотите навести порядок в пищеварении.",
  },
  {
    title: "К вечеру гудят ноги и ноют суставы",
    body: "Когда после тяжёлого дня спина и колени буквально отказываются сгибаться, а стопы требуют немедленного расслабления.",
  },
  {
    title: "Стресс стал вашим постоянным спутником",
    body: "Вы не можете уснуть от роя мыслей, срываетесь по пустякам и чувствуете, что нервы на пределе.",
  },
  {
    title: "Вы хотите поддержать организм без химии",
    body: "Ищете проверенные способы укрепить сердце и сосуды, вернуть здоровый блеск волосам и свежесть лицу с помощью доступных продуктов.",
  },
  {
    title: "Вы часто оказываетесь отрезаны от цивилизации",
    body: "Живёте в деревне, уезжаете в командировки, на вахту или дачу, где под рукой нет круглосуточной аптеки, но есть базовые продукты.",
  },
  {
    title: "Хотите помочь близким тем, что есть дома",
    body: "Родители, партнёр, дети. Не бежать в аптеку за каждым першением — собрать напиток из мёда, лука и того, что лежит в холодильнике.",
  },
];

const CHAPTERS = [
  {
    roman: "I",
    title: "Синдром хронической усталости",
    blurb: "Голова тяжёлая, совсем не думает. 24 рецепта для сил, настроения и энергии.",
  },
  {
    roman: "II",
    title: "Проверенные временем тёплые напитки",
    blurb: "20 рецептов, которыми родители поднимали нас на ноги.",
  },
  {
    roman: "III",
    title: "Дискомфорт после еды",
    blurb: "22 рецепта от тяжести и вздутия в животе.",
  },
  {
    roman: "IV",
    title: "Забота о кишечнике",
    blurb: "10 мягких рецептов с кефиром, черносливом, льном и кашами при редком стуле.",
  },
  {
    roman: "V",
    title: "Скорая помощь при изжоге",
    blurb: "10 обволакивающих каш и киселей без лимона и томата.",
  },
  {
    roman: "VI",
    title: "Поддержка и укрепление сосудов",
    blurb: "21 рецепт из свёклы, чеснока и зелени без лишней соли.",
  },
  {
    roman: "VII",
    title: "Домашнее спа: ванночки и компрессы",
    blurb: "17 расслабляющих процедур для уставших стоп и коленей.",
  },
  {
    roman: "VIII",
    title: "Естественная красота: кожа, волосы, глаза",
    blurb: "16 экспресс-средств против тусклого лица, секущихся волос и усталости глаз.",
  },
  {
    roman: "IX",
    title: "Антистресс: когда сдают нервы",
    blurb: "Не еда. 10 дыхательных и телесных практик за 3 минуты.",
  },
];

const INCLUDED = [
  "150 рецептов с фото и полным описанием",
  "Граммовки, шаги и противопоказания",
  "Можно скачать и открывать без интернета",
  "Можете читать как с телефона, так и с компьютера",
];

const FAQ = [
  {
    q: "В каком виде я получу книгу?",
    a: "Сразу после оплаты откроется полная электронная книга: 150 рецептов с фото. Можно скачать и открывать без интернета. Можете читать как с телефона, так и с компьютера.",
  },
  {
    q: "Заменяют ли данные рецепты поход к врачу?",
    a: "Нет. Книга носит ознакомительный и кулинарный характер. Рецепты не являются лекарствами, назначениями и не заменяют врача. Перед изменением рациона и при хронических заболеваниях проконсультируйтесь с лечащим врачом.",
  },
  {
    q: "Нужны ли какие-то особые ингредиенты?",
    a: "Нет. Лук, мёд, свёкла, овсянка, кефир, ромашка из аптеки у дома. Если продукта нет — в рецепте обычно есть замена.",
  },
  {
    q: "Почему сейчас 890 ₽, а не 2 400?",
    a: "Сейчас акция. Обычная цена — 2 400 ₽. Я делюсь тем, что проверял на себе годами. Покупка книги — поддержка для меня. Для вас — полезная информация под рукой.",
  },
];

function Home() {
  const owned = usePurchase((s) => s.owned);
  const sample = SAMPLE_IDS.map((id) => recipeById(id)!);

  return (
    <div className="min-h-svh bg-paper">
      <SiteHeader />

      <section className="relative isolate min-h-[88svh] overflow-hidden bg-forest text-cream">
        <img
          src={photo("hero")}
          alt="Тимофей Багров играет с Майей"
          className="absolute inset-0 h-full w-full object-cover object-[46%_20%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:pb-16">
          <p className="kicker text-cream/70">Тимофей Багров</p>
          <h1 className="mt-3 max-w-3xl font-display text-[2rem] leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            150 таёжных рецептов, которые работают
          </h1>
          <p className="mt-4 max-w-xl font-serif text-base leading-relaxed text-cream/90 sm:mt-6 sm:text-xl">
            Я собрал 150 рецептов из того, что всегда есть дома или можно легко
            найти в ближайшем магазине или у соседа.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            {owned ? (
              <Button size="xl" variant="cream" asChild>
                <Link to="/book" search={{ r: 1 }}>
                  Открыть книгу
                </Link>
              </Button>
            ) : (
              <Button size="xl" variant="cream" asChild>
                <a href="#toc">Посмотреть содержание</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:py-24">
        <BookCover className="mx-auto w-full max-w-[320px] lg:max-w-[380px]" />
        <div>
          <p className="kicker text-clay">О чём книга</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Здоровье без аптек: сила привычных продуктов.
          </h2>
          <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-ink-soft">
            <p>
              Рецепты натуральных смесей и напитков, которые годами доказывают
              свою эффективность и прямо сейчас лежат в вашем холодильнике.
            </p>
          </div>
        </div>
      </section>

      <section id="for-whom" className="bg-forest py-16 text-cream sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Эта книга для вас, если:
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-cream/10 sm:grid-cols-2">
            {FOR_WHOM.map((s) => (
              <article
                key={s.title}
                className="bg-forest-2 p-5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 sm:p-6"
              >
                <h3 className="font-display text-xl leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-cream/75">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="toc" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="kicker text-clay">Содержание</p>
        <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          Оглавление
        </h2>
        <ol className="mt-12">
          {CHAPTERS.map((sec) => (
            <li
              key={sec.title}
              className="grid gap-3 border-t border-line py-8 last:border-b sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-8"
            >
              <span className="font-display text-5xl leading-none text-clay sm:text-6xl">
                {sec.roman}
              </span>
              <div>
                <p className="font-display text-2xl leading-snug tracking-tight sm:text-3xl">
                  {sec.title}
                </p>
                <p className="mt-2 max-w-2xl font-serif text-lg text-muted">
                  {sec.blurb}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="sample" className="bg-paper-2/50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-clay">Внутри книги</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Как будут выглядеть рецепты
          </h2>
          <div className="mt-4 max-w-2xl space-y-3 font-serif text-lg leading-relaxed text-ink-soft">
            <p>К каждому рецепту идёт фото с ингредиентами и в готовом виде.</p>
            <p>Описания — для кого, почему советую и как приготовить.</p>
            <p>
              Для ознакомления с книгой мы открыли по одному рецепту из трёх
              глав.
            </p>
          </div>
          <div className="mt-12 flex flex-col gap-16 sm:gap-20">
            {sample.map((r, i) => (
              <div
                key={r.id}
                className={i === 0 ? "" : "border-t border-line pt-16 sm:pt-20"}
              >
                <RecipeSpread recipe={r} reverse={i % 2 === 1} />
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            {owned ? (
              <Button size="lg" asChild>
                <Link to="/book" search={{ r: 1 }}>
                  Читать все 150
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <BuyDialog>
                <Button size="lg">
                  Открыть остальные {book.recipes.length - sample.length} рецептов
                  <ArrowRight className="size-4" />
                </Button>
              </BuyDialog>
            )}
          </div>
        </div>
      </section>

      <section id="author" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] lg:items-start lg:py-24">
        <div>
          <p className="kicker text-clay">Автор</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Тимофей Багров
          </h2>
          <div className="mt-5 max-w-2xl space-y-4 font-serif text-lg leading-relaxed text-ink-soft">
            <p>Экс-фельдшер скорой.</p>
            <p>
              Четыре года назад уехал с собакой Майей жить в тайгу — за сотни
              километров от цивилизации и аптек.
            </p>
            <p>
              Возрождаю и тестирую на себе методы выживания наших дедов. Делюсь
              тем, что работает.
            </p>
            <p>
              Бонусом в конце книги оставил для тебя 6 коротких записей, на
              случай если тебе сейчас тяжело. Не болейте, друзья!
            </p>
          </div>
        </div>
        <img
          src={photo("author")}
          alt="Тимофей Багров и Майя"
          width={1008}
          height={1792}
          className="h-auto w-full rounded-lg"
        />
      </section>

      <section id="buy" className="bg-forest py-16 text-cream sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <p className="kicker text-cream/55">Электронная книга</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              150 таёжных рецептов, которые работают
            </h2>
            <ul className="mt-8 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 font-sans text-sm text-cream/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-cream" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-cream/15 bg-forest-2 p-6">
            <p className="font-sans text-[0.7rem] tracking-[0.18em] text-clay uppercase">
              Акция
            </p>
            <SalePrice size="lg" invert className="mt-2" />
            <p className="mt-2 font-serif text-sm text-cream/65">
              Книга откроется сразу. Можно читать и скачать.
            </p>
            <div className="mt-6">
              {owned ? (
                <Button variant="cream" size="lg" className="w-full" asChild>
                  <Link to="/book" search={{ r: 1 }}>
                    Открыть книгу
                  </Link>
                </Button>
              ) : (
                <BuyDialog>
                  <Button variant="cream" size="lg" className="w-full">
                    Получить книгу
                  </Button>
                </BuyDialog>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="kicker text-clay">FAQ</p>
        <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          Частые вопросы
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none font-display text-xl leading-snug text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="font-sans text-2xl font-light text-clay group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 font-serif text-base leading-relaxed text-ink-soft">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="kicker text-clay">Важно</p>
        <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          Отказ от ответственности
        </h2>
        <div className="mt-5 space-y-4 font-serif text-lg leading-relaxed text-ink-soft">
          <p>
            Данная книга носит исключительно ознакомительный и кулинарный
            характер.
          </p>
          <p>
            Рецепты смузи и коктейлей не являются лекарственными средствами,
            медицинскими назначениями или заменой профессионального лечения.
          </p>
          <p>
            Перед изменением рациона и при наличии хронических заболеваний
            обязательно проконсультируйтесь с лечащим врачом.
          </p>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-10 text-center">
        <p className="font-serif text-base text-ink-soft">
          Техподдержка по всем вопросам, связанным с заказом книги
        </p>
        <a
          href="mailto:vikramodin@gmail.com"
          className="mt-2 inline-block font-sans text-sm text-clay hover:text-ink"
        >
          vikramodin@gmail.com
        </a>
        <a
          href="https://t.me/MusicNPC_AI"
          target="_blank"
          rel="noreferrer"
          className="mt-2 block font-sans text-sm text-clay hover:text-ink"
        >
          Telegram · @MusicNPC_AI
        </a>
        <p className="mt-4 font-sans text-xs text-muted">
          © {new Date().getFullYear()} Тимофей Багров
        </p>
      </footer>
    </div>
  );
}
