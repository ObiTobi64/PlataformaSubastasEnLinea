import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { IBid } from "../interfaces/IBid";
import { useBidStore } from "../store/useBidStore";

interface TimerData {
  id: string;
  type: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface ServerToClientEvents {
  INITIAL_DATA: (data: { timers: TimerData[] }) => void;
  UPDATE_DATA: (data: { timers: TimerData[] }) => void;
  BID_UPDATE: (data: IBid) => void;
  BID_ERROR: (error: string) => void;
  AUCTION_END: (data: { productId: string; winner: IBid }) => void;
}

export const useAppWebSocket = () => {
  const WEBSOCKET_URL = "http://localhost:3001";
  const [timers, setTimers] = useState<Record<string, TimerData>>({});
  const [connectionStatus, setConnectionStatus] = useState("Connecting");
  const [bidError, setBidError] = useState<string | null>(null);

  const setCurrentBid = useBidStore((state) => state.setCurrentBid);
  const addBid = useBidStore((state) => state.addBid);

  const socketRef = useRef<Socket<ServerToClientEvents> | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(WEBSOCKET_URL, {
        reconnection: true,
        reconnectionDelay: 3000,
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        setConnectionStatus("Open");
      });

      socket.on("disconnect", () => {
        setConnectionStatus("Closed");
      });

      const handleData = (data: { timers: TimerData[] }) => {
        const newTimers = data.timers.reduce(
          (acc: Record<string, TimerData>, timer) => {
            acc[timer.id] = timer;
            return acc;
          },
          {}
        );
        setTimers(newTimers);
      };

      socket.on("INITIAL_DATA", handleData);
      socket.on("UPDATE_DATA", handleData);

      socket.on("BID_UPDATE", async (bid: IBid) => {
        setCurrentBid(bid.auctionId, bid);
        addBid(bid.auctionId, bid);
        setBidError(null);
      });

      socket.on("BID_ERROR", (error: string) => {
        setBidError(error);
        setTimeout(() => setBidError(null), 3000);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const placeBid = (auctionId: string, amount: number, userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("BID_UPDATE", {
        auctionId,
        amount,
        userId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return {
    timers,
    connectionStatus,
    bidError,
    placeBid,
  };
};
