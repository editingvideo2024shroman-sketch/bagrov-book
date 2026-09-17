import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Apple,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartPulse,
  Mail,
  Shield,
  Sparkles,
  Sprout,
  Wheat,
  Zap,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { BookCover } from "@/components/book-cover";
import { BuyDialog } from "@/components/buy-dialog";
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
    blurb: "Тяжесть в голове, дефицит энергии, упадок сил. Витаминные смеси за 2 минуты в блендере.",
    count: "24 рецепта",
    Icon: Zap,
  },
  {
    roman: "II",
    title: "Проверенные тёплые напитки",
    blurb: "Первые симптомы простуды, озноб и слабость. Те самые согревающие рецепты, которыми родители в детстве мгновенно поднимали нас на ноги.",
    count: "20 рецептов",
    Icon: Shield,
  },
  {
    roman: "III",
    title: "Дискомфорт после еды",
    blurb: "Вздутие, тяжесть и распирание живота. Лёгкие домашние смеси для быстрого перезапуска пищеварения.",
    count: "22 рецепта",
    Icon: Apple,
  },
  {
    roman: "IV",
    title: "Забота о кишечнике",
    blurb: "Редкий и нерегулярный стул. Мягкое очищение без слабительных: правильные сочетания кефира, льна и чернослива.",
    count: "10 рецептов",
    Icon: Wheat,
  },
  {
    roman: "V",
    title: "Скорая помощь при изжоге",
    blurb: "«Пожар» в груди и раздражённый желудок. Обволакивающие кисели и каши строго без лимона и томатов.",
    count: "10 рецептов",
    Icon: Droplets,
  },
  {
    roman: "VI",
    title: "Поддержка сосудов",
    blurb: "Скачки давления и холестерин. Оздоровление капилляров силой свёклы, чеснока и зелени без лишней соли.",
    count: "21 рецепт",
    Icon: HeartPulse,
  },
  {
    roman: "VII",
    title: "Домашнее спа для ног",
    blurb: "Вечерний гул, отёки и усталость, когда к ночи не согнуться. 15-минутные ванночки и компрессы.",
    count: "17 рецептов",
    Icon: Sprout,
  },
  {
    roman: "VIII",
    title: "Кожа, волосы, лицо",
    blurb: "Тусклый тон, выпадение волос и шелушения. Натуральные маски и ополаскиватели из 2–3 продуктов из холодильника.",
    count: "16 рецептов",
    Icon: Sparkles,
  },
  {
    roman: "IX",
    title: "Антистресс: когда сдают нервы",
    blurb: "Паника, фоновая тревога и выгорание. Дыхание и телесные техники за 3 минуты — без еды и таблеток.",
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
    q: "Нужны ли какие-то особые ингредиенты?",
    a: "Нет. Лук, мёд, свёкла, овсянка, кефир, ромашка из аптеки у дома. Если продукта нет — в рецепте обычно есть замена.",
  },
  {
    q: "Смогу ли я приготовить рецепты без специальных навыков?",
    a: "Каждый из 150 рецептов расписан предельно понятно и пошагово: указаны точные граммовки (в ложках и граммах), температура воды, время настаивания, способ приёма и обязательные предостережения.",
  },
  {
    q: "Заменяют ли данные рецепты поход к врачу?",
    a: "Нет. Книга носит ознакомительный и кулинарный характер. Рецепты не являются лекарствами, назначениями и не заменяют врача. Перед изменением рациона и при хронических заболеваниях проконсультируйтесь с лечащим врачом.",
  },
];

function Home() {
  const owned = usePurchase((s) => s.owned);

  return (
    <div className="min-h-svh bg-paper">
      <section className="px-4 pt-6 pb-4 sm:px-6 sm:pt-10">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col items-start gap-4">
            <h1 className="sr-only">150 таёжных рецептов, которые работают</h1>
            <div className="w-full rounded-2xl border border-line bg-cream px-5 py-6 sm:px-7 sm:py-7">
              <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-clay uppercase">
                О чём книга
              </p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink-soft sm:text-xl">
                Я собрал 150 проверенных временем рецептов из того, что всегда
                есть у вас дома, в ближайшем супермаркете или на грядке у соседа.
                Это готовая система домашнего оздоровления без агрессивной химии,
                редкой экзотики и сложных аптечных сиропов.
              </p>
            </div>
            <Button size="xl" asChild>
              <a href="#toc">Открыть содержание</a>
            </Button>
          </div>
          <BookCover className="w-full max-w-[340px] lg:max-w-[400px]" />
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
          <ChapterCarousel />
        </div>
      </section>

      <section id="author" className="px-4 py-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-start gap-6 rounded-2xl border border-line bg-cream px-5 py-6 sm:px-7 lg:grid-cols-[1fr_minmax(14rem,20rem)]">
          <div>
            <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-clay uppercase">
              Автор
            </p>
            <h2 className="mt-2 font-display text-2xl leading-snug sm:text-3xl">
              Тимофей Багров
            </h2>
            <div className="mt-3 space-y-2 font-serif text-sm leading-relaxed text-ink-soft sm:text-base">
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
            className="h-auto w-full rounded-xl object-contain"
          />
        </div>
      </section>

      <section id="buy" className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl border border-line bg-cream px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="max-w-xl">
            <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-clay uppercase">
              Электронная книга
            </p>
            <ul className="mt-4 space-y-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 font-sans text-sm text-ink-soft">
                  <Check className="mt-0.5 size-4 shrink-0 text-clay" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-clay uppercase">
              Акция для читателей блога
            </p>
            <SalePrice size="md" className="mt-2 sm:justify-end" />
            <p className="mt-2 font-serif text-sm text-muted">
              Книга откроется сразу. Можно читать и скачать.
            </p>
            <div className="mt-4">
              {owned ? (
                <Button className="w-full sm:w-auto" asChild>
                  <Link to="/book" search={{ r: 1 }}>
                    Открыть книгу
                  </Link>
                </Button>
              ) : (
                <BuyDialog>
                  <Button className="w-full sm:w-auto">Получить книгу</Button>
                </BuyDialog>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-line bg-cream px-5 py-6 sm:px-7">
          <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-clay uppercase">
            Частые вопросы
          </p>
          <div className="mt-4 space-y-2">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl bg-paper px-4 py-3"
              >
                <summary className="cursor-pointer list-none font-display text-lg leading-snug text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream font-sans text-xl font-light text-clay group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 rounded-xl bg-cream px-4 py-3 font-serif text-sm leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-line bg-cream px-5 py-5 sm:px-7">
          <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-muted uppercase">
            Важно
          </p>
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
            Данная книга носит исключительно ознакомительный и кулинарный характер.
            Рецепты смузи и коктейлей не являются лекарственными средствами,
            медицинскими назначениями или заменой профессионального лечения. Перед
            изменением рациона и при наличии хронических заболеваний обязательно
            проконсультируйтесь с лечащим врачом.
          </p>
        </div>
      </section>

      <section id="care" className="px-4 py-4 sm:px-6 sm:pb-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-2xl border border-line bg-cream px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <div className="max-w-2xl">
            <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-clay uppercase">
              Служба заботы
            </p>
            <p className="mt-1 font-display text-lg leading-snug sm:text-xl">
              Не пришло письмо или остались вопросы по оплате?
            </p>
            <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
              Ссылка доставляется за 1–2 минуты. Если письма нет во входящих и в
              папке «Спам», или возникли любые сложности — напишите нам, мы на
              связи и сразу поможем.
            </p>
          </div>
          <a
            href="https://t.me/MusicNPC_AI"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex shrink-0 items-center justify-center rounded-full bg-clay px-5 py-3 font-sans text-sm font-medium text-cream-fg hover:bg-clay-hover sm:mt-0"
          >
            Написать в поддержку
          </a>
        </div>

        <div className="mx-auto mt-4 grid max-w-6xl gap-8 rounded-2xl bg-forest px-5 py-7 text-cream-fg sm:grid-cols-[1fr_auto] sm:items-start sm:px-8 sm:py-8">
          <div>
            <p className="font-sans text-[0.65rem] font-semibold tracking-[0.16em] text-cream-fg/55 uppercase">
              Будьте здоровы
            </p>
            <p className="mt-1 font-display text-2xl">Тимофей Багров</p>
            <p className="mt-3 font-sans text-sm text-cream-fg/75">
              Шамин Роман Александрович
            </p>
            <p className="font-sans text-sm text-cream-fg/75">ИНН 222222</p>
            <div className="mt-4 flex flex-col gap-1 font-sans text-sm">
              <Link to="/privacy" className="text-cream-fg/80 underline-offset-2 hover:underline">
                Политика конфиденциальности
              </Link>
              <Link to="/offer" className="text-cream-fg/80 underline-offset-2 hover:underline">
                Публичная оферта
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex gap-2">
              <a
                href="mailto:vikramodin@gmail.com"
                aria-label="Почта"
                className="flex size-10 items-center justify-center rounded-full border border-cream-fg/20 text-cream-fg hover:bg-cream-fg/10"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="https://t.me/MusicNPC_AI"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="flex size-10 items-center justify-center rounded-full border border-cream-fg/20 text-cream-fg hover:bg-cream-fg/10"
              >
                <TelegramIcon />
              </a>
            </div>
            <a
              href="mailto:vikramodin@gmail.com"
              className="font-sans text-sm text-cream-fg/80"
            >
              vikramodin@gmail.com
            </a>
            <a
              href="https://t.me/MusicNPC_AI"
              target="_blank"
              rel="noreferrer"
              className="font-sans text-sm text-cream-fg/80"
            >
              Telegram · @MusicNPC_AI
            </a>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-8 text-center">
        <p className="font-sans text-xs text-muted">
          © {new Date().getFullYear()} Все права защищены.
        </p>
      </footer>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M21.5 3.3 2.8 10.5c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8 1 .8.5 0 .7-.2 1-.6l2.7-2.6 5.6 4.1c1 .6 1.8.3 2-.9l3.7-17.4c.4-1.5-.5-2.2-1.6-1.6Z" />
    </svg>
  );
}

function ChapterCard({ sec }: { sec: (typeof CHAPTERS)[number] }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-cream p-5 shadow-[0_8px_24px_-18px_rgb(26_20_16/0.35)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-paper-2 text-clay">
          <sec.Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span className="rounded-full bg-paper-2 px-3 py-1 font-sans text-[0.7rem] text-muted">
          {sec.count}
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug">{sec.title}</h3>
      <p className="mt-3 flex-1 rounded-xl bg-paper px-3 py-3 font-serif text-sm leading-relaxed text-ink-soft">
        <span className="mb-1 block font-sans text-[0.65rem] tracking-[0.14em] text-muted uppercase">
          Что внутри
        </span>
        {sec.blurb}
      </p>
    </article>
  );
}

function ChapterCarousel() {
  const n = CHAPTERS.length;
  const [i, setI] = useState(0);
  const startX = useRef(0);

  function go(d: number) {
    setI((x) => (x + d + n) % n);
  }

  return (
    <>
      <div className="mt-10 hidden gap-5 lg:grid lg:grid-cols-2">
        {CHAPTERS.map((c) => (
          <ChapterCard key={c.roman} sec={c} />
        ))}
      </div>
      <div className="mt-8 max-w-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="rounded-full bg-paper-2 px-3 py-1 font-sans text-sm text-muted">
            {i + 1} / {n}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Предыдущая глава"
              onClick={() => go(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink shadow-sm active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Следующая глава"
              onClick={() => go(1)}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink shadow-sm active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
        <div
          className="mt-5 grid"
          onTouchStart={(e) => {
            startX.current = e.touches[0]?.clientX ?? 0;
          }}
          onTouchEnd={(e) => {
            const x = e.changedTouches[0]?.clientX ?? 0;
            const dx = x - startX.current;
            if (dx < -40) go(1);
            if (dx > 40) go(-1);
          }}
        >
          {CHAPTERS.map((c, idx) => (
            <div
              key={c.roman}
              className="col-start-1 row-start-1"
              style={{ visibility: idx === i ? "visible" : "hidden" }}
              aria-hidden={idx !== i}
            >
              <ChapterCard sec={c} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
