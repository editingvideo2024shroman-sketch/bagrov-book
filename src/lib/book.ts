import raw from "@/data/book.json";

export type SectionId = "i" | "ii" | "iii" | "iv" | "v" | "vi" | "vii" | "viii" | "ix";

export type Recipe = {
  id: number;
  section: SectionId;
  title: string;
  why: string;
  benefit: string;
  ingredients: string;
  cook: string;
  take: string;
  contra: string;
  image: string;
  kind?: "food" | "practice";
};

export type Section = {
  id: SectionId;
  roman: string;
  title: string;
  short: string;
  intro: string;
};

export type Note = {
  id: number;
  title: string;
  body: string;
  image: string;
};

export type Book = {
  title: string;
  subtitle: string;
  author: string;
  price: number;
  listPrice: number;
  pagesHint: string;
  disclaimer: string;
  sections: Section[];
  recipes: Recipe[];
  notesIntro: string;
  notes: Note[];
};

export const book = raw as Book;

export const SAMPLE_IDS: readonly number[] = [];

export function photo(key: string) {
  return `/photos/${key}.jpg?v=14`;
}

export function sectionOf(id: SectionId) {
  return book.sections.find((s) => s.id === id)!;
}

export function recipesIn(id: SectionId) {
  return book.recipes.filter((r) => r.section === id);
}

export function recipeById(id: number) {
  return book.recipes.find((r) => r.id === id);
}

export function noteById(id: number) {
  return book.notes.find((n) => n.id === id);
}

export function nextRecipe(id: number) {
  return book.recipes.find((r) => r.id === id + 1) ?? null;
}

export function prevRecipe(id: number) {
  return book.recipes.find((r) => r.id === id - 1) ?? null;
}
