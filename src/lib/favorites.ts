import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavState = {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
};

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
    }),
    { name: "taiga-favorites" },
  ),
);
