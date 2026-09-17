import { photo, sectionOf, type Recipe } from "@/lib/book";
import { cn } from "@/lib/utils";

export function RecipeBlock({
  recipe,
  kicker,
}: {
  recipe: Recipe;
  kicker?: string;
}) {
  const practice = recipe.kind === "practice";
  return (
    <article className="overflow-hidden border border-line bg-cream">
      <img
        src={photo(recipe.image)}
        alt={recipe.title}
        className="aspect-4/3 w-full object-cover"
      />
      <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-8">
        <header>
          {kicker ? (
            <p className="mb-2 font-sans text-[0.7rem] tracking-[0.18em] text-muted uppercase">
              {kicker}
            </p>
          ) : null}
          <p className="font-sans text-xs tracking-[0.16em] text-clay uppercase">
            {practice ? `Приём ${recipe.id}` : `Рецепт ${recipe.id}`}
          </p>
          <h3 className="mt-1 font-display text-3xl leading-tight text-ink">
            {recipe.title}
          </h3>
        </header>
        <RecipeFields recipe={recipe} />
      </div>
    </article>
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
          className="aspect-4/3 w-full object-cover"
        />
        <figcaption className="mt-3 font-sans text-[0.7rem] tracking-[0.16em] text-muted uppercase">
          Глава {sec.roman}. {sec.short} · {practice ? "Приём" : "Рецепт"}{" "}
          {recipe.id}
        </figcaption>
      </figure>
      <div className="flex flex-col gap-5 lg:pt-1">
        <header>
          <h3 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
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
      <Field label="Для кого" body={recipe.why} />
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
    <section>
      <h4 className="font-sans text-[0.7rem] tracking-[0.16em] text-muted uppercase">
        {label}
      </h4>
      <p className="mt-1.5 font-serif text-[1.05rem] leading-relaxed text-ink-soft">
        {body}
      </p>
    </section>
  );
}
