import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Apple,
  Check,
  Droplets,
  Flame,
  HeartPulse,
  Sparkles,
  Sprout,
  Wheat,
  Zap,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { BookCover } from "@/components/book-cover";
import { BuyDialog } from "@/components/buy-dialog";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { photo } from "@/lib/book";
import { usePurchase } from "@/lib/purchase";
import { SalePrice } from "@/components/sale-price";

export const Route = createFileRoute("/")({ component: Home });

const FOR_WHOM = [
  {
    title: "Постоянная боль в суставах, спине или перепады давления",
    body: "Таблетки приносят лишь временное облегчение или вредят желудку. Вам нужны проверенные натуральные рецепты для безопасного и регулярного восстановления организма.",
  },
  {
    title: "Тревожность, плохой сон и упадок сил",
    body: "Хронический стресс не даёт полноценно отдыхать по ночам. Необходимы мягкие успокаивающие сборы и вечерние ритуалы, которые вернут глубокий сон без дневной сонливости и привыкания.",
  },
  {
    title: "Поиск безопасных средств при простуде у детей",
    body: "При первых признаках кашля или жара важно иметь чёткий план действий. Вам нужны надёжные домашние методы без химических сиропов, искусственных красителей и лишней нагрузки на детский организм.",
  },
  {
    title: "Потребность в проверенном домашнем руководстве",
    body: "Больше не придётся собирать сомнительные советы на форумах. Вы получите под рукой чёткий справочник с точными дозировками, пошаговыми рецептами и обязательным указанием противопоказаний.",
  },
];

const CHAPTERS: {
  roman: string;
  title: string;
  blurb: string;
  count: string;
  Icon: LucideIcon;
}[] = [
  {
    roman: "I",
    title: "Синдром хронической усталости",
    blurb: "Как убрать ощущение «тяжёлой головы» и вернуть ясность мыслей, когда нет сил даже на простые бытовые дела. Пошаговые рецепты витаминных и тонизирующих смесей, которые готовятся за 2 минуты в блендере или обычной кастрюле без редких экзотических ингредиентов.",
    count: "24 рецепта",
    Icon: Zap,
  },
  {
    roman: "II",
    title: "Проверенные тёплые напитки",
    blurb: "Уютные, согревающие вкусы из детства, которыми родители мгновенно поднимали нас на ноги при первых признаках простуды. Правильные пропорции и секреты заваривания ромашки, лука, мёда и малины, чтобы они работали как мощный природный щит, а не просто вкусный чай.",
    count: "20 рецептов",
    Icon: Flame,
  },
  {
    roman: "III",
    title: "Дискомфорт после еды",
    blurb: "Быстрое избавление от мучительной тяжести, распирания и вздутия живота после обеда. Мягкие травяные сборы и лёгкие домашние смеси, которые мгновенно «включают» пищеварение, убирают спазмы и возвращают лёгкость в теле.",
    count: "22 рецепта",
    Icon: Apple,
  },
  {
    roman: "IV",
    title: "Забота о кишечнике",
    blurb: "Скорая помощь при нерегулярном и редком стуле без агрессивных аптечных слабительных. Мягкое и предсказуемое очищение организма с помощью правильных сочетаний кефира, чернослива, льна и особых каш, которые мягко запустят кишечник как часы.",
    count: "10 рецептов",
    Icon: Wheat,
  },
  {
    roman: "V",
    title: "Скорая помощь при изжоге",
    blurb: "Как за считанные минуты погасить «пожар» в груди и защитить пищевод. Простые рецепты нежных обволакивающих каш и домашних киселей, составленные со строгим исключением скрытых триггеров изжоги (без лимона, томатов и кислот), которые мгновенно успокоят раздражённую слизистую.",
    count: "10 рецептов",
    Icon: Droplets,
  },
  {
    roman: "VI",
    title: "Поддержка сосудов",
    blurb: "Доступная природная профилактика для защиты сердца и чистки сосудов. Сила привычных продуктов — свёклы, чеснока и свежей зелени — в рецептах со сниженным содержанием соли, которые помогают мягко поддержать давление и тонус.",
    count: "21 рецепт",
    Icon: HeartPulse,
  },
  {
    roman: "VII",
    title: "Домашнее спа для ног",
    blurb: "Настоящее спасение после тяжёлого дня на ногах или сидячей работы, когда к вечеру невозможно разогнуться от усталости. Рецепты ванночек и компрессов, которые за 15 минут снимут гул, отёки и подарят ногам ощущение лёгкости.",
    count: "17 рецептов",
    Icon: Sprout,
  },
  {
    roman: "VIII",
    title: "Кожа, волосы, лицо",
    blurb: "Секреты сияющей кожи, густых волос и свежего лица без трат на дорогую салонную косметику. Натуральные маски и ополаскиватели из 2–3 продуктов из холодильника.",
    count: "16 рецептов",
    Icon: Sparkles,
  },
  {
    roman: "IX",
    title: "Антистресс: когда сдают нервы",
    blurb: "Уникальный раздел, где нет рецептов еды. Дыхательные упражнения и телесные практики, которые за 3 минуты заземлят в момент сильной паники, снимут фоновую тревогу и перезагрузят нервную систему.",
    count: "10 практик",
    Icon: Brain,
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

  return (
    <div className="min-h-svh bg-paper">
      <SiteHeader />

      <section className="relative isolate min-h-[88svh] overflow-hidden bg-forest text-cream-fg">
        <img
          src={photo("hero")}
          alt="Тимофей Багров играет с Майей"
          className="absolute inset-0 h-full w-full object-cover object-[46%_20%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:pb-16">
          <p className="kicker text-cream-fg/70">Тимофей Багров</p>
          <h1 className="mt-3 max-w-3xl font-display text-[2rem] leading-[1.05] tracking-tight text-cream-fg sm:text-5xl lg:text-6xl">
            150 таёжных рецептов, которые работают
          </h1>
          <p className="mt-4 max-w-xl font-serif text-base leading-relaxed text-cream-fg/90 sm:mt-6 sm:text-xl">
            Я собрал 150 рецептов из того, что всегда есть дома или можно легко
            найти в ближайшем магазине или у соседа.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <Button size="xl" variant="cream" asChild>
              <a href="#toc">Открыть содержание</a>
            </Button>
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

      <section id="for-whom" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-clay">Для кого эта книга</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Узнаете себя в этих ситуациях?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {FOR_WHOM.map((s, i) => (
              <article
                key={s.title}
                className="rounded-2xl border border-line bg-cream p-5 shadow-[0_8px_24px_-18px_rgb(26_20_16/0.35)] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 active:-translate-y-1 sm:p-6"
              >
                <p className="mb-3 inline-flex size-9 items-center justify-center rounded-full bg-paper-2 font-sans text-sm font-semibold text-ink">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-xl leading-snug">{s.title}</h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="toc" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-clay">Структура книги</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            150 рецептов в 9 главах
          </h2>
          <p className="mt-6 font-sans text-sm text-clay lg:hidden">
            Листайте в сторону →
          </p>
          <div className="snap-row mt-4 flex touch-pan-x flex-nowrap gap-4 overflow-x-auto overscroll-x-contain pb-3 lg:mt-10 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0">
            {CHAPTERS.map((sec) => (
              <article
                key={sec.roman}
                className="w-[82%] shrink-0 snap-center rounded-2xl border border-line bg-cream p-5 shadow-[0_8px_24px_-18px_rgb(26_20_16/0.35)] transition-transform duration-200 hover:-translate-y-1 active:-translate-y-1 lg:w-auto lg:snap-align-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-paper-2 text-clay">
                    <sec.Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="rounded-full bg-paper-2 px-3 py-1 font-sans text-[0.7rem] text-muted">
                    {sec.count}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug">
                  {sec.title}
                </h3>
                <p className="mt-3 rounded-xl bg-paper px-3 py-3 font-serif text-sm leading-relaxed text-ink-soft">
                  <span className="mb-1 block font-sans text-[0.65rem] tracking-[0.14em] text-muted uppercase">
                    Что внутри
                  </span>
                  {sec.blurb}
                </p>
              </article>
            ))}
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

      <section id="buy" className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <p className="kicker text-clay">Электронная книга</p>
            <ul className="mt-6 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 font-sans text-sm text-ink-soft">
                  <Check className="mt-0.5 size-4 shrink-0 text-clay" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-cream p-6 shadow-[0_8px_24px_-18px_rgb(26_20_16/0.35)]">
            <p className="font-sans text-[0.7rem] tracking-[0.18em] text-clay uppercase">
              Акция для читателей блога
            </p>
            <SalePrice size="lg" className="mt-2" />
            <p className="mt-2 font-serif text-sm text-muted">
              Книга откроется сразу. Можно читать и скачать.
            </p>
            <div className="mt-6">
              {owned ? (
                <Button size="lg" className="w-full" asChild>
                  <Link to="/book" search={{ r: 1 }}>
                    Открыть книгу
                  </Link>
                </Button>
              ) : (
                <BuyDialog>
                  <Button size="lg" className="w-full">
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
        <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
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

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="font-sans text-[0.7rem] font-semibold tracking-[0.16em] text-muted uppercase">
          Важно
        </p>
        <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
          Данная книга носит исключительно ознакомительный и кулинарный характер.
          Рецепты смузи и коктейлей не являются лекарственными средствами,
          медицинскими назначениями или заменой профессионального лечения. Перед
          изменением рациона и при наличии хронических заболеваний обязательно
          проконсультируйтесь с лечащим врачом.
        </p>
      </section>

      <section id="care" className="border-t border-line py-8 sm:py-10">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-sans text-[0.7rem] font-semibold tracking-[0.16em] text-clay uppercase">
            Служба заботы
          </p>
          <p className="mt-2 font-display text-xl leading-snug">
            Не пришло письмо с книгой или остались вопросы по оплате?
          </p>
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
            Ссылка доставляется за 1–2 минуты. Если письма нет во входящих и в
            папке «Спам», или возникли любые сложности — напишите нам, мы на
            связи и сразу поможем.
          </p>
          <div className="mt-4">
            <Button size="sm" asChild>
              <a href="https://t.me/MusicNPC_AI" target="_blank" rel="noreferrer">
                Написать в Telegram
              </a>
            </Button>
          </div>
          <a
            href="mailto:vikramodin@gmail.com"
            className="mt-3 inline-block font-sans text-sm text-clay hover:text-ink"
          >
            vikramodin@gmail.com
          </a>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-8 text-center">
        <p className="font-sans text-xs text-muted">
          © {new Date().getFullYear()} Тимофей Багров
        </p>
      </footer>
    </div>
  );
}
