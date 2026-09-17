import { create } from "zustand";
import { persist } from "zustand/middleware";

type PurchaseState = {
  owned: boolean;
  email: string;
  name: string;
  buy: (payload: { email: string; name: string }) => void;
};

export const usePurchase = create<PurchaseState>()(
  persist(
    (set) => ({
      owned: false,
      email: "",
      name: "",
      buy: ({ email, name }) => set({ owned: true, email, name }),
    }),
    { name: "kogda-daleko-purchase" },
  ),
);
