import { create } from "zustand";
import type { IAuction } from "../interfaces/IAuction";
import { persist } from "zustand/middleware";
import {
  createAuction,
  deleteAuction,
  getAuctions,
  updateAuction,
} from "../services/auctionService";

interface IAuctionStore {
  auctions: IAuction[];
  isLoading: boolean;
  error: string | null;
  fetchAuctions: () => void;
  getAuctionById: (id: string) => IAuction | undefined;
  createAuction: (auction: IAuction) => void;
  updateAuction: (auction: IAuction) => void;
  deleteAuction: (id: string) => void;
}

export const useAuctionStore = create<IAuctionStore>()(
  persist(
    (set, get) => ({
      auctions: [],
      isLoading: false,
      error: null,
      fetchAuctions: async () => {
        try {
          set({ isLoading: true, error: null });
          const auctions = await getAuctions();
          set({ auctions: auctions });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      getAuctionById: (id: string) => {
        const { auctions } = get();
        return auctions.find((auction) => auction.id!.toString() === id);
      },
      createAuction: async (auction: IAuction) => {
        try {
          set({ isLoading: true });
          const newAuction = await createAuction(auction);
          if (!newAuction) {
            throw new Error("auction.createError");
          }
          set((state) => ({
            auctions: [...state.auctions, newAuction],
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      deleteAuction: async (id: string) => {
        try {
          set({ isLoading: true });
          await deleteAuction(id);
          set((state) => ({
            auctions: state.auctions.filter(
              (auction) => auction.id!.toString() !== id
            ),
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
      updateAuction: async (auction: IAuction) => {
        try {
          set({ isLoading: true });
          const updatedAuction = await updateAuction(auction.id!, auction);
          if (!updatedAuction) {
            throw new Error("auction.updateError");
          }
          set((state) => ({
            auctions: state.auctions.map((a) =>
              a.id === updatedAuction.id ? updatedAuction : a
            ),
          }));
        } catch (error) {
          const err = error as Error;
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "auctions" }
  )
);
