import { magazineOf, photo, sectionOf, type Recipe } from "@/lib/book";
import { SaveRecipe } from "@/components/save-recipe";
import { cn } from "@/lib/utils";

export function RecipeBlock({
  recipe,
  kicker,
  saveable = false,
}: {
  recipe: Recipe;
  kicker?: string;
  saveable?: boolean;
}) {
  const practice = recipe.kind === "practice";
  const frames = magazineOf(recipe.image);
  return (
    <article className="overflow-hidden rounded-2xl bg-[#fbf7f1] text-[#2b241c] shadow-[0_18px_50px_-36px_rgb(43_36_28/0.55)] ring-1 ring-[#e6dccb]">
      {frames ? (
        <img
          src={photo(frames.use)}
          alt={recipe.title}
          className="aspect-3/2 w-full object-cover"
        />
      ) : (
        <img
          src={photo(recipe.image)}
          alt={recipe.title}
          className="aspect-4/3 w-full object-cover"
        />
      )}
      <div className="flex flex-col gap-6 px-5 py-7 sm:px-9 sm:py-9">
        <header>
          {kicker ? (
            <p className="mb-2 font-sans text-[0.68rem] tracking-[0.2em] text-[#8a7968] uppercase">
              {kicker}
            </p>
          ) : null}
          <p className="font-sans text-[0.68rem] tracking-[0.2em] text-[#6d5b4a] uppercase">
            {practice ? `Приём ${recipe.id}` : `Рецепт ${recipe.id}`}
          </p>
          <h3 className="mt-2 font-display text-[2rem] leading-[1.12] tracking-tight text-[#2b241c] sm:text-4xl">
            {recipe.title}
          </h3>
          {saveable ? (
            <div className="mt-3">
              <SaveRecipe id={recipe.id} />
            </div>
          ) : null}
        </header>

        <p className="font-serif text-[1.12rem] leading-[1.7] text-[#4e463d]">
          {recipe.benefit}
        </p>

        {frames ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Frame src={photo(frames.ing)} caption="Что берём" alt="Ингредиенты" />
            <Frame src={photo(frames.ready)} caption="Что получается" alt="Готовый напиток" />
          </div>
        ) : null}

        <div className="divide-y divide-[#eadfce] border-y border-[#eadfce]">
          <Field
            label={practice ? "Что нужно" : "Ингредиенты"}
            body={recipe.ingredients}
          />
          <Field
            label={practice ? "Как делать" : "Как приготовить"}
            body={recipe.cook}
          />
          <Field
            label={practice ? "Когда и сколько" : "Как принимать"}
            body={recipe.take}
          />
        </div>

        <section className="rounded-xl bg-[#f3ebe1] px-4 py-3.5 ring-1 ring-[#e4d3bc]">
          <h4 className="font-sans text-[0.68rem] tracking-[0.18em] text-[#8a5a3c] uppercase">
            Кому нельзя
          </h4>
          <p className="mt-1.5 font-serif text-[1.02rem] leading-relaxed text-[#5c4a3d]">
            {recipe.contra}
          </p>
        </section>
      </div>
    </article>
  );
}

function Frame({ src, caption, alt }: { src: string; caption: string; alt: string }) {
  return (
    <figure>
      <img src={src} alt={alt} className="aspect-3/2 w-full rounded-xl object-cover" />
      <figcaption className="mt-2 font-sans text-[0.68rem] tracking-[0.16em] text-[#8a7968] uppercase">
        {caption}
      </figcaption>
    </figure>
  );
}

export function RecipeSpread({
  recipe,
  reverse = false,
}: {
  recipe: Recipe;
  reverse?: boolean;
}) {
  const sec = sectionOf(recipe.section);
  const practice = recipe.kind === "practice";
  return (
    <article className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
      <figure className={cn(reverse && "lg:order-2")}>
        <img
          src={photo(recipe.image)}
          alt={recipe.title}
          className="aspect-4/3 w-full rounded-xl object-cover"
        />
        <figcaption className="mt-3 font-sans text-[0.7rem] tracking-[0.16em] text-muted uppercase">
          Глава {sec.roman}. {sec.short} · {practice ? "Приём" : "Рецепт"}{" "}
          {recipe.id}
        </figcaption>
      </figure>
      <div className="flex flex-col gap-5 lg:pt-1">
        <header>
          <h3 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {recipe.title}
          </h3>
        </header>
        <RecipeFields recipe={recipe} />
      </div>
    </article>
  );
}

function RecipeFields({ recipe }: { recipe: Recipe }) {
  const practice = recipe.kind === "practice";
  return (
    <>
      <Field label="Почему советую" body={recipe.benefit} />
      <Field
        label={practice ? "Что нужно" : "Ингредиенты"}
        body={recipe.ingredients}
      />
      <Field
        label={practice ? "Как делать" : "Как приготовить"}
        body={recipe.cook}
      />
      <Field
        label={practice ? "Когда и сколько" : "Как принимать"}
        body={recipe.take}
      />
      <Field label="Противопоказания" body={recipe.contra} />
    </>
  );
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <section className="py-4 first:pt-4">
      <h4 className="font-sans text-[0.68rem] tracking-[0.18em] text-[#6d5b4a] uppercase">
        {label}
      </h4>
      <p className="mt-1.5 font-serif text-[1.05rem] leading-[1.65] text-[#4e463d]">
        {body}
      </p>
    </section>
  );
}