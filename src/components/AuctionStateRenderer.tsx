import { Box, Typography } from "@mui/material";
import type { IAuction } from "../interfaces/IAuction";
import { auctionTypes } from "../constants/auctionTypes";

type AuctionState = "upcoming" | "active" | "ended";

interface AuctionStateRendererProps {
  auction: IAuction;
  timer?: {
    type: string;
    timeLeft: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  };
  loading?: boolean;
  children: (
    auction: IAuction,
    state: AuctionState,
    timeInfo: {
      timeLeft?: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
      };
      isEnded: boolean;
      isActive: boolean;
      isUpcoming: boolean;
    }
  ) => React.ReactNode;
}

export const AuctionStateRenderer = ({
  auction,
  timer,
  loading = false,
  children,
}: AuctionStateRendererProps) => {
  const getAuctionState = (): AuctionState => {
    if (timer?.type === auctionTypes.FUTURE) return "upcoming";
    if (timer?.type === auctionTypes.PRESENT) return "active";
    return "ended";
  };

  const getTimeInfo = () => {
    const state = getAuctionState();
    return {
      timeLeft: timer?.timeLeft,
      isEnded: state === "ended",
      isActive: state === "active",
      isUpcoming: state === "upcoming",
    };
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body2" color="text.secondary">
          Loading auction...
        </Typography>
      </Box>
    );
  }

  const state = getAuctionState();
  const timeInfo = getTimeInfo();

  return <>{children(auction, state, timeInfo)}</>;
};
