import { useState, useEffect } from "react";
import { useAuctionStore } from "../store/useAuctionStore";
import type { IBid } from "../interfaces/IBid";
import { getBidHistoryByUserId } from "../services/bidService";
import { useAuth } from "../context/AuthContext";

interface BidStatistics {
  totalBids: number;
  totalSpent: number;
  auctionsParticipated: number;
  auctionsWon: number;
  averageBid: number;
}

export const useBidHistory = () => {
  const { user } = useAuth();
  const { auctions } = useAuctionStore();
  const [userBids, setUserBids] = useState<IBid[]>([]);
  const [statistics, setStatistics] = useState<BidStatistics>({
    totalBids: 0,
    totalSpent: 0,
    auctionsParticipated: 0,
    auctionsWon: 0,
    averageBid: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserBidHistory = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const userBidHistory = await getBidHistoryByUserId(user.id);
      setUserBids(userBidHistory);
      calculateStatistics(userBidHistory);
    } catch (err) {
      setError("Error loading bid history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (bids: IBid[]) => {
    if (bids.length === 0) {
      setStatistics({
        totalBids: 0,
        totalSpent: 0,
        auctionsParticipated: 0,
        auctionsWon: 0,
        averageBid: 0,
      });
      return;
    }

    const totalBids = bids.length;
    const auctionsParticipated = new Set(bids.map((bid) => bid.auctionId)).size;
    const totalSpent = bids.reduce((sum, bid) => sum + bid.amount, 0);
    const averageBid = totalSpent / totalBids;

    const auctionGroups = bids.reduce((acc: Record<string, IBid[]>, bid) => {
      if (!acc[bid.auctionId]) acc[bid.auctionId] = [];
      acc[bid.auctionId].push(bid);
      return acc;
    }, {});

    let auctionsWon = 0;
    const now = new Date().getTime();
    Object.values(auctionGroups).forEach((auctionBids) => {
      const highestBid = auctionBids.reduce((highest, current) =>
        current.amount > highest.amount ? current : highest
      );
      if (highestBid.userId === user?.id) {
        const auction = auctions.find(
          (auction) => auction.id.toString() === highestBid.auctionId
        );
        if (auction && new Date(auction.endTime).getTime() < now) {
          auctionsWon++;
        }
      }
    });

    setStatistics({
      totalBids,
      totalSpent,
      auctionsParticipated,
      auctionsWon,
      averageBid,
    });
  };

  const getAuctionInfo = (auctionId: string) => {
    return auctions.find((auction) => auction.id.toString() === auctionId);
  };

  useEffect(() => {
    if (user?.id) {
      loadUserBidHistory();
    }
  }, [user?.id]);

  return {
    userBids,
    statistics,
    loading,
    error,
    getAuctionInfo,
  };
};
