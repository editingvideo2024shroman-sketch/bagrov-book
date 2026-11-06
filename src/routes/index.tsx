import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { BuyDialog } from "@/components/buy-dialog";
import { goal } from "@/components/metrika";
import { Button } from "@/components/ui/button";
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
    title: "Первые признаки простуды",
    body: "Горло, насморк, озноб. Вечер, а до аптеки далеко. Нужны понятные домашние напитки без аптечных сиропов и лишней химии.",
  },
  {
    title: "Потребность в проверенном домашнем руководстве",
    body: "Больше не придётся собирать сомнительные советы на форумах. Вы получите под рукой чёткий справочник с точными дозировками, пошаговыми рецептами и обязательным указанием противопоказаний.",
  },
];

const INCLUDED = [
  {
    title: "150 рецептов в 9 главах для всего организма",
    detail: "От давления и суставов до сна и иммунитета",
  },
  {
    title: "Граммовки, фото и противопоказания",
    detail: "К каждому рецепту",
  },
  {
    title: "Личные заметки Тимофея",
    detail: "Почему нужно это пить и для чего",
  },
  {
    title: "Бессрочный доступ",
    detail: "Файл сохраняется на вашем устройстве навсегда",
  },
];

const FAQ = [
  {
    q: "В каком виде я получу справочник?",
    a: "Ссылки на обе книги придут на почту вместе с чеком. Если письма нет, проверьте папку «Спам». Читать можно с телефона и с компьютера.",
  },
  {
    q: "Нужны ли какие-то особые ингредиенты?",
    a: "Нет. Редких трав не нужно. Лук, мёд, свёкла, овсянка, кефир, ромашка и другие простые продукты, которые обычно есть дома или в ближайшем магазине.",
  },
  {
    q: "Смогу ли я приготовить рецепты без специальных навыков?",
    a: "Каждый из 150 рецептов расписан предельно понятно и пошагово: указаны точные граммовки (в ложках и граммах), температура воды, время настаивания, способ приёма и обязательные предостережения.",
  },
];

function Home() {
  const owned = usePurchase((s) => s.owned);

  return (
    <div className="min-h-svh bg-paper">
      <section className="px-4 pt-6 pb-4 sm:px-6 sm:pt-10">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col items-start gap-5">
            <p className="pill">
              Авторский сборник Тимофея Багрова
            </p>
            <h1 className="max-w-xl font-sans text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[2.35rem]">
              150 таёжных рецептов: проверенная система домашнего оздоровления
            </h1>
            <div className="max-w-xl space-y-3 font-serif text-base leading-relaxed text-ink-soft sm:text-lg">
              <p>
                Вернуть силы и лёгкость после 40 — обычной едой с вашей кухни.
              </p>
              <p>
                Рецепты для оживления всего тела: от тяжести после еды, утренней
                вялости, отёков, изжоги, проблем с кишечником, плохого сна и
                расшатанных нервов.
              </p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[440px] rounded-[1.6rem] bg-white p-2.5 shadow-[0_16px_40px_-28px_rgb(26_20_16/0.55)]">
            <img
              src="/photos/hero-hold.jpg?v=6"
              alt="Тимофей Багров и Майя со справочником"
              width={1400}
              height={2508}
              className="h-auto w-full rounded-[1.25rem] object-contain"
            />
          </div>
        </div>
      </section>

      <section id="for-whom" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="pill">Для кого эта книга</p>
          <h2 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-[2.15rem]">
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
                <h3 className="font-sans text-lg font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="buy" className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="order-3 grid items-center gap-6 rounded-2xl border border-line bg-cream px-5 py-6 sm:px-7 sm:py-7 lg:col-span-2 lg:grid-cols-[1fr_15.5rem]">
            <div className="rounded-xl border border-line bg-white px-4 py-3">
              <p className="font-sans text-[0.68rem] font-semibold tracking-[0.16em] text-clay uppercase">
                Бонусом
              </p>
              <p className="mt-1 font-sans text-base font-semibold text-ink">
                Книга «Лёгкая»
              </p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-ink-soft">
                50 рецептов на завтрак, обед и ужин. У каждой тарелки посчитаны калории, белки, жиры и углеводы.
              </p>
            </div>
            <img
              src="/photos/plate-cover.jpg"
              alt="Книга «Лёгкая» — 50 рецептов правильного питания"
              width={900}
              height={1200}
              className="mx-auto w-full max-w-[220px] rounded-xl object-contain shadow-[0_18px_40px_-24px_rgb(26_20_16/0.55)] max-lg:order-first lg:max-w-none"
            />
          </div>
          <div className="contents">
          <div id="pay" className="order-2 scroll-mt-24 rounded-2xl border border-line bg-cream px-5 py-6 sm:px-7 lg:col-start-2 lg:row-start-1">
            <p className="pill">
              Акция для читателей блога
            </p>
            <SalePrice size="md" className="mt-2" />
            <div className="mt-3 space-y-1.5 text-left font-serif text-sm leading-snug text-muted">
              <p>Обе книги придут на почту вместе с чеком.</p>
            </div>
            <div className="mt-4 flex w-full flex-col gap-3">
              {owned ? (
                <Button className="w-full" size="lg" asChild>
                  <Link to="/book" search={{ r: 1 }}>
                    Открыть справочник
                  </Link>
                </Button>
              ) : (
                <>
                  <BuyDialog source="price">
                    <Button className="w-full" size="lg">
                      Получить справочник
                    </Button>
                  </BuyDialog>
                  <p className="text-center font-sans text-xs leading-snug text-muted">
                    Если письма нет, проверьте папку «Спам».
                  </p>
                  <div className="flex items-center gap-3 py-1">
                    <span className="h-px flex-1 bg-line" />
                    <span className="font-sans text-[0.68rem] text-muted">
                      если карта не подошла
                    </span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-line bg-paper text-sm font-semibold"
                    asChild
                  >
                    <a
                      href="https://web.tribute.tg/p/FdZ"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => goal("foreign_card")}
                    >
                      <Globe className="size-4 text-sky-700" />
                      Оплатить зарубежной картой
                    </a>
                  </Button>
                  <p className="text-center font-sans text-xs leading-snug text-muted">
                    Украина, США, Европа и весь мир через Telegram
                  </p>
                  <a
                    href="https://t.me/MusicNPC_AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => goal("manager")}
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-left font-sans text-sm font-semibold leading-snug text-ink hover:bg-paper-2"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#229ED9] text-white">
                      <TelegramIcon />
                    </span>
                    Если не получилось оплатить, напишите менеджеру лично
                  </a>
                  <p className="flex items-center justify-center gap-1.5 text-center font-sans text-xs text-muted">
                    <Shield className="size-3.5 shrink-0" />
                    Безопасное соединение
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="order-1 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7 sm:py-8 lg:col-start-1 lg:row-start-1">
            <p className="pill">
              Электронный справочник
            </p>
            <h2 className="mt-3 max-w-xl font-sans text-2xl font-semibold leading-tight text-ink sm:text-[1.85rem]">
              150 проверенных рецептов из тайги, которые действительно работают
            </h2>
            <ul className="mt-6 space-y-4">
              {INCLUDED.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-clay" />
                  <div>
                    <p className="font-sans text-base font-medium leading-snug text-ink">
                      {item.title}
                    </p>
                    <p className="mt-0.5 font-sans text-sm leading-snug text-muted">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </section>
MARKER_STOP