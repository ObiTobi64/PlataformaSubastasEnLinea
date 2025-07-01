import { create } from "zustand";
import type { IBid } from "../interfaces/IBid";

interface IBidStore {
  bidsByAuction: Record<string, IBid[]>;
  currentBids: Record<string, IBid>;

  setBidsForAuction: (auctionId: string, bids: IBid[]) => void;
  addBid: (auctionId: string, bid: IBid) => void;
  setCurrentBid: (auctionId: string, bid: IBid) => void;

  getCurrentBid: (auctionId: string) => IBid | undefined;
  getBidsForAuction: (auctionId: string) => IBid[];
}

export const useBidStore = create<IBidStore>((set, get) => ({
  bidsByAuction: {},
  currentBids: {},
  winners: {},

  setBidsForAuction: (auctionId, bids) => {
    set((state) => ({
      bidsByAuction: {
        ...state.bidsByAuction,
        [auctionId]: bids,
      },
    }));
  },

  addBid: (auctionId, bid) => {
    set((state) => ({
      bidsByAuction: {
        ...state.bidsByAuction,
        [auctionId]: [...(state.bidsByAuction[auctionId] || []), bid],
      },
    }));
  },

  setCurrentBid: (auctionId, bid) => {
    set((state) => ({
      currentBids: {
        ...state.currentBids,
        [auctionId]: bid,
      },
    }));
  },

  getCurrentBid: (auctionId) => {
    const { currentBids } = get();
    return currentBids[auctionId];
  },

  getBidsForAuction: (auctionId) => {
    const { bidsByAuction } = get();
    return bidsByAuction[auctionId] || [];
  },
}));
