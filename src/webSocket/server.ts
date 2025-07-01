import { Server } from "socket.io";
import http from "http";
import fs from "fs";
import path from "path";
import { auctionTypes } from "./constants/auctionTypes";
import { IAuction } from "../interfaces/IAuction";

const PORT = 3001;
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export interface IBid {
  id?: string;
  auctionId: string;
  amount: number;
  userId: string;
  timestamp?: string;
}

const auctionBids: Record<string, IBid[]> = {};
const currentHighestBids: Record<string, IBid> = {};
const auctionWinners: Record<string, IBid> = {};

const getAuctions = () => {
  try {
    const dbPath = path.join(__dirname, "../db.json");
    const data = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(data);
    return db.auctions || [];
  } catch (error) {
    console.error("Error reading from db.json:", error);
    return [];
  }
};

const getBidsByAuctionId = (auctionId: string): IBid[] => {
  try {
    const dbPath = path.join(__dirname, "../frontend/src/db.json");
    const data = fs.readFileSync(dbPath, "utf-8");
    const db = JSON.parse(data);
    const allBids = db.bids || [];

    return allBids.filter(
      (bid: IBid) => bid.auctionId === auctionId.toString()
    );
  } catch (error) {
    console.error("Error reading bids from db.json:", error);
    return [];
  }
};

const loadHighestBidsFromDatabase = () => {
  const auctions = getAuctions();
  let totalBidsLoaded = 0;

  auctions.forEach((auction: IAuction) => {
    const auctionBids = getBidsByAuctionId(auction.id!.toString());

    if (auctionBids.length > 0) {
      const highestBid = auctionBids.reduce((highest, current) => {
        return current.amount > highest.amount ? current : highest;
      });

      currentHighestBids[auction.id!.toString()] = highestBid;
      totalBidsLoaded++;

      console.log(
        `Auction ${auction.id}: Loaded highest bid $${highestBid.amount} by user ${highestBid.userId}`
      );
    }
  });

  console.log("Current highest bids:", Object.keys(currentHighestBids));
};

const getAuctionType = (startTime: string, endTime: string) => {
  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return auctionTypes.FUTURE;
  if (now >= start && now <= end) return auctionTypes.PRESENT;
  return auctionTypes.PAST;
};

const calculateTimeLeft = (endTime: string) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const difference = end - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

const processAuctions = () => {
  const auctions = getAuctions().map((auction: IAuction) => {
    const calculatedType = getAuctionType(
      auction.startTime || new Date().toISOString(),
      auction.endTime
    );

    if (calculatedType === auctionTypes.PAST && !auctionWinners[auction.id!]) {
      const highestBid = currentHighestBids[auction.id!];
      if (highestBid) {
        auctionWinners[auction.id!] = highestBid;
        io.emit("AUCTION_END", {
          productId: auction.id,
          winner: highestBid,
        });
        console.log(
          `Auction ${auction.id} ended. Winner: User ${highestBid.userId} with $${highestBid.amount}`
        );
      }
    }

    return {
      ...auction,
      type: calculatedType,
    };
  });

  const auctionTimers = auctions.map((auction: IAuction) => ({
    id: auction.id,
    type: auction.type,
    timeLeft: calculateTimeLeft(auction.endTime),
  }));

  return { timers: auctionTimers };
};

const validateBid = (bid: IBid): { isValid: boolean; error?: string } => {
  const auctions = getAuctions();
  const auction = auctions.find(
    (a: IAuction) => a.id!.toString() === bid.auctionId
  );

  if (!auction) {
    return { isValid: false, error: "Auction not found" };
  }

  const auctionType = getAuctionType(
    auction.startTime || new Date().toISOString(),
    auction.endTime
  );

  if (auctionType !== auctionTypes.PRESENT) {
    return { isValid: false, error: "Auction is not active" };
  }

  const currentBid = currentHighestBids[bid.auctionId];
  const minBid = currentBid ? currentBid.amount + 1 : auction.basePrice;

  if (bid.amount < minBid) {
    return {
      isValid: false,
      error: `Bid must be at least $${minBid}`,
    };
  }

  return { isValid: true };
};

loadHighestBidsFromDatabase();

let timerInterval: NodeJS.Timeout;

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  const { timers } = processAuctions();
  socket.emit("INITIAL_DATA", { timers });

  console.log(
    `Sending ${
      Object.keys(currentHighestBids).length
    } current bids to new client`
  );
  Object.entries(currentHighestBids).forEach(([auctionId, bid]) => {
    console.log(
      `Sending bid for auction ${auctionId}: $${bid.amount} by user ${bid.userId}`
    );
    socket.emit("BID_UPDATE", bid);
  });

  // Handle new bids
  socket.on("BID_UPDATE", (bidData: IBid) => {
    console.log("Nueva puja recibida:", bidData);

    const validation = validateBid(bidData);

    if (!validation.isValid) {
      console.log("Bid validation failed:", validation.error);
      socket.emit("BID_ERROR", validation.error);
      return;
    }

    if (!auctionBids[bidData.auctionId]) {
      auctionBids[bidData.auctionId] = [];
    }

    auctionBids[bidData.auctionId].push(bidData);
    currentHighestBids[bidData.auctionId] = bidData;

    io.emit("BID_UPDATE", bidData);

    console.log(
      `Puja aceptada: $${bidData.amount} por usuario ${bidData.userId} en subasta ${bidData.auctionId}`
    );
  });

  socket.on(
    "PLACE_BID",
    (data: { auctionId: string; amount: number; userId: string }) => {
      const bidData: IBid = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      console.log("PLACE_BID recibido:", bidData);

      const validation = validateBid(bidData);

      if (!validation.isValid) {
        console.log("PLACE_BID validation failed:", validation.error);
        socket.emit("BID_ERROR", validation.error);
        return;
      }

      // Update in-memory storage
      if (!auctionBids[bidData.auctionId]) {
        auctionBids[bidData.auctionId] = [];
      }

      auctionBids[bidData.auctionId].push(bidData);
      currentHighestBids[bidData.auctionId] = bidData;

      // Broadcast to all clients
      io.emit("BID_UPDATE", bidData);

      console.log(
        `PLACE_BID aceptada: $${bidData.amount} por usuario ${bidData.userId} en subasta ${bidData.auctionId}`
      );
    }
  );

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Error en Socket.IO:", error);
  });
});

timerInterval = setInterval(() => {
  if (io.engine.clientsCount > 0) {
    const { timers } = processAuctions();
    io.emit("UPDATE_DATA", { timers });
  }
}, 1000);

server.listen(PORT, () => {
  console.log(`Socket.IO server escuchando en http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("Cerrando servidor...");
  clearInterval(timerInterval);
  io.close(() => {
    console.log("Servidor Socket.IO cerrado.");
    server.close(() => {
      console.log("Servidor HTTP cerrado.");
      process.exit(0);
    });
  });
});
