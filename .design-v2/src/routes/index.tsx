import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { BookCover } from "@/components/book-cover";
import { BuyDialog } from "@/components/buy-dialog";
import { RecipeSpread } from "@/components/recipe-block";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SAMPLE_IDS, book, photo, recipeById } from "@/lib/book";
import { usePurchase } from "@/lib/purchase";
import { rub } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

const FOR_WHOM = [
  {
    title: "Нету сил даже встать с кровати",
    body: "Усталость, пустая голова. Нужно что-то простое на сегодня.",
  },
  {
    title: "Простыли",
    body: "Горло, насморк, ломота. Вечер, а до аптеки далеко.",
  },
  {
    title: "Дискомфорт в животе",
    body: "Тяжесть после еды, вздутие, запор, изжога.",
  },
  {
    title: "Мучает давление и отёки",
    body: "Шум в голове, тяжесть, отекают ноги.",
  },
  {
    title: "Часто ноют суставы",
    body: "Спина, колени, стопы. К ночи не согнуться.",
  },
  {
    title: "Кожа, волосы, глаза",
    body: "Тускнеет лицо, секутся волосы, устают глаза.",
  },
  {
    title: "Сдают нервы",
    body: "Не уснуть, раздражение, всё на взводе. Нужно что-то тёплое на вечер.",
  },
  {
    title: "Вы далеко от города",
    body: "Вахта, деревня, командировка. Аптека не рядом.",
  },
];

const CHAPTERS = [
  {
    roman: "I",
    title: "Не хватает сил на самые простые действия",
    blurb:
      "Голова тяжёлая, совсем не думает. 24 рецепта для сил, настроения и энергии.",
    count: "24 рецепта",
  },
  {
    roman: "II",
    title: "Если простыл",
    blurb: "20 рецептов, которыми родители поднимали нас на ноги.",
    count: "20 рецептов",
  },
  {
    roman: "III",
    title: "Проблемы с животом",
    blurb: "22 рецепта от вздутия, запоров и изжоги.",
    count: "22 рецепта",
  },
  {
    roman: "IV",
    title: "Давление, отёки, сосуды",
    blurb: "21 рецепт, когда шумит в голове и отекают ноги.",
    count: "21 рецепт",
  },
  {
    roman: "V",
    title: "Ноги и суставы",
    blurb: "17 ванночек и компрессов, когда ноет и не согнуться.",
    count: "17 рецептов",
  },
  {
    roman: "VI",
    title: "Кожа, волосы, глаза",
    blurb: "16 средств, когда тускнеет лицо, секутся волосы, устают глаза.",
    count: "16 рецептов",
  },
  {
    roman: "VII",
    title: "Когда сдают нервы",
    blurb:
      "Не еда. Десять приёмов, как дышать, куда деть руки и что делать за три минуты.",
    count: "10 приёмов",
  },
];

const INCLUDED = [
  "130 рецептов с фото, включая 10 приёмов для нервов",
  "Граммовки, шаги и противопоказания",
  "Можно скачать и открывать без интернета",
  "Можете читать как с телефона, так и с компьютера",
];

const FAQ = [
  {
    q: "В каком виде я получу книгу?",
    a: "Сразу после оплаты откроется полная электронная книга: 130 рецептов с фото. Можно скачать и открывать без интернета. Можете читать как с телефона, так и с компьютера.",
  },
  {
    q: "Заменяют ли данные рецепты поход к врачу?",
    a: "Нет. Рецепты не ставят диагноз и не заменяют врача. Это домашние смеси и ванночки из того, что есть на кухне. Если боль острая, температура высокая, одышка или вы падаете — сначала обратитесь к врачу. Книга не поможет при серьёзной болезни и может только усугубить.",
  },
  {
    q: "Нужны ли какие-то особые ингредиенты?",
    a: "Нет. Лук, мёд, свёкла, овсянка, кефир, ромашка из аптеки у дома. Если продукта нет — в рецепте обычно есть замена.",
  },
  {
    q: "Почему 890 ₽, а не бесплатно?",
    a: "Я делюсь тем, что проверял на себе годами. Покупка книги — поддержка для меня. Для вас — полезная информация под рукой.",
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
          className="absolute inset-0 h-full w-full object-cover object-[42%_42%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-ink/20" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 sm:pb-20">
          <p className="kicker text-cream/70">Тимофей Багров</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            130 домашних рецептов, которые работают
          </h1>
          <p className="mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/90">
            Я собрал 130 рецептов из того, что всегда есть дома или можно легко
            найти в ближайшем магазине или у соседа.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
            Первая помощь, когда до цивилизации далеко.
          </h2>
          <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-ink-soft">
            <p>
              Рецепты эффективных смесей и целебных напитков, которые помогли
              мне и которые точно прямо сейчас лежат на вашей кухне.
            </p>
            <p>
              В конце бонусом разобрали 6 важных тем. Возможно, как раз тебе это
              нужно сейчас услышать.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-forest py-16 text-cream sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-cream/55">Для кого</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Эта книга подойдёт вам, если
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {FOR_WHOM.map((s, i) => (
              <article key={s.title} className="bg-forest-2 p-5 sm:p-6">
                <p className="font-display text-2xl text-clay">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl leading-snug">
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
              className="grid gap-3 border-t border-line py-8 last:border-b sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-8"
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
              <span className="kicker self-start text-muted sm:self-center">
                {sec.count}
              </span>
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
                  Читать все 130
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

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] lg:items-start lg:py-24">
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
              {book.title}
            </h2>
            <p className="mt-3 font-serif text-lg text-cream/80">
              130 рецептов из того, что есть дома.
            </p>
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
            <p className="font-display text-6xl tracking-tight">{rub(book.price)}</p>
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
          Информация носит ознакомительный характер
        </h2>
        <div className="mt-5 space-y-4 font-serif text-lg leading-relaxed text-ink-soft">
          <p>Друзья! Это мой личный опыт. У вас всё может быть иначе.</p>
          <p>
            Не является медицинской рекомендацией и не заменяет врача. Если у
            вас серьёзные проблемы — идите в больницу.
          </p>
          <p>Здоровья вам. Не болейте!</p>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-10 text-center">
        <p className="font-display text-xl">{book.title}</p>
        <p className="mt-3 mx-auto max-w-xl font-serif text-sm leading-relaxed text-muted">
          {book.disclaimer}
        </p>
        <p className="mt-4 font-sans text-xs text-muted">
          © {new Date().getFullYear()} Тимофей Багров
        </p>
      </footer>
    </div>
  );
}
