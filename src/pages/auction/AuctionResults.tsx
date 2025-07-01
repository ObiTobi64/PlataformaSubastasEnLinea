import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
  TextField,
  MenuItem,
} from "@mui/material";
import { EmojiEvents, Timeline, TrendingUp, People } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuctionStore } from "../../store/useAuctionStore";
import { useBidStore } from "../../store/useBidStore";
import { useUserStore } from "../../store/useUserStore";

const TabPanel = ({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const AuctionResults = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");

  const auctions = useAuctionStore((state) => state.auctions);
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);
  const getBidsForAuction = useBidStore((state) => state.getBidsForAuction);
  const getUserById = useUserStore((state) => state.getUserById);
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  useEffect(() => {
    if (auctions.length === 0) fetchAuctions();
    if (users.length === 0) fetchUsers();
  }, []);

  const getWinner = (auctionId: string) => {
    const auction = auctions.find((a) => a.id.toString() === auctionId);
    if (!auction) return undefined;

    const now = new Date().getTime();
    const endTime = new Date(auction.endTime).getTime();
    const hasEnded = endTime < now;

    if (hasEnded) {
      return getCurrentBid(auctionId);
    }

    return undefined;
  };

  const stats = {
    totalAuctions: auctions.length,
    completedAuctions: auctions.filter((auction) => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      return endTime < now;
    }).length,
    totalRevenue: auctions.reduce((total, auction) => {
      const winner = getWinner(auction.id.toString());
      return total + (winner ? winner.amount : 0);
    }, 0),
    totalParticipants: new Set(
      auctions.flatMap((auction) =>
        getBidsForAuction(auction.id.toString()).map((bid) => bid.userId)
      )
    ).size,
  };

  const filteredAuctions = auctions.filter((auction) => {
    const now = new Date().getTime();
    const endTime = new Date(auction.endTime).getTime();

    switch (filterStatus) {
      case "completed":
        return endTime < now;
      case "active":
        return endTime > now;
      case "sold":
        return getWinner(auction.id.toString()) !== undefined;
      default:
        return true;
    }
  });

  const topBidders = Object.entries(
    auctions.reduce((acc, auction) => {
      const bids = getBidsForAuction(auction.id.toString());
      bids.forEach((bid) => {
        if (!acc[bid.userId]) {
          acc[bid.userId] = { totalBids: 0, totalAmount: 0, wins: 0 };
        }
        acc[bid.userId].totalBids++;
        acc[bid.userId].totalAmount += bid.amount;

        const winner = getWinner(auction.id.toString());
        if (winner && winner.userId === bid.userId) {
          acc[bid.userId].wins++;
        }
      });
      return acc;
    }, {} as Record<string, { totalBids: number; totalAmount: number; wins: number }>)
  )
    .map(([userId, stats]) => ({ userId, ...stats }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box p={3}>
      <link
        rel="stylesheet"
        href="https://horizon-tailwind-react-corporate-7s21b54hb-horizon-ui.vercel.app/static/css/main.d7f96858.css"
      />

      <div className="h-auto bg-gray-50 flex items-center fade-in ">
        <section className="w-full bg-cover bg-center py-32 relative" style={{ backgroundImage: 'url(https://img.freepik.com/vector-premium/fondo-banner-diseno-portada-web-redes-sociales_906484-6.jpg)' }}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto text-center text-white relative z-10">
           <Typography
              variant="h3"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main", m: 5 }}
            >
              {t("results.title") || "Auction Results & Statistics"}
            </Typography>
          </div>
        </section>
      </div>
      

      <div className="min-w-[375px] md:min-w-[700px] xl:min-w-[800px] mt-3  mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <Timeline />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("results.totalAuctions") || "Total Auctions"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {stats.totalAuctions}
            </h4>
          </div>
        </div>

        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <EmojiEvents />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("results.completedAuctions") || "Completed"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {stats.completedAuctions}
            </h4>
          </div>
        </div>

        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <TrendingUp />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("results.totalRevenue") || "Total Revenue"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              ${stats.totalRevenue.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <People />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("results.participants") || "Participants"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {stats.totalParticipants}
            </h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t("results.allAuctions") || "All Auctions"} />
          <Tab label={t("results.topBidders") || "Top Bidders"} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CardContent>
            {/* Filter */}
            <Box mb={3}>
              <TextField
                select
                label={t("results.filter") || "Filter"}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">{t("results.all") || "All"}</MenuItem>
                <MenuItem value="completed">
                  {t("results.completed") || "Completed"}
                </MenuItem>
                <MenuItem value="active">
                  {t("results.active") || "Active"}
                </MenuItem>
                <MenuItem value="sold">{t("results.sold") || "Sold"}</MenuItem>
              </TextField>
            </Box>

            {/* Auctions Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("results.auction") || "Auction"}</TableCell>
                    <TableCell>
                      {t("results.basePrice") || "Base Price"}
                    </TableCell>
                    <TableCell>
                      {t("results.finalPrice") || "Final Price"}
                    </TableCell>
                    <TableCell>{t("results.winner") || "Winner"}</TableCell>
                    <TableCell>{t("results.status") || "Status"}</TableCell>
                    <TableCell>{t("results.endDate") || "End Date"}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAuctions.map((auction) => {
                    const winner = getWinner(auction.id.toString());
                    const currentBid = getCurrentBid(auction.id.toString());
                    const winnerUser = getUserById(winner?.userId || "");
                    const now = new Date().getTime();
                    const endTime = new Date(auction.endTime).getTime();
                    const isCompleted = endTime < now;

                    return (
                      <TableRow key={auction.id}>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {auction.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="text.secondary">
                            ${auction.basePrice}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={winner ? "primary.main" : "text.secondary"}
                            fontWeight={winner ? "bold" : "normal"}
                          >
                            {winner
                              ? `$${winner.amount}`
                              : currentBid
                              ? `$${currentBid.amount}`
                              : "No bids"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {winnerUser ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 24, height: 24 }}>
                                {winnerUser.username[0].toUpperCase()}
                              </Avatar>
                              <Typography variant="body2">
                                {winnerUser.username}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {isCompleted
                                ? t("results.noWinner")
                                : t("results.ongoing")}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              isCompleted
                                ? winner
                                  ? "Sold"
                                  : "Ended"
                                : "Active"
                            }
                            color={
                              isCompleted
                                ? winner
                                  ? "success"
                                  : "default"
                                : "primary"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(auction.endTime).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("results.topBiddersTitle") || "Top Bidders by Total Amount"}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("results.rank")}</TableCell>
                    <TableCell>{t("results.user")}</TableCell>
                    <TableCell>{t("results.totalBids")}</TableCell>
                    <TableCell>{t("results.totalAmount")}</TableCell>
                    <TableCell>{t("results.wins") || "Wins"}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topBidders.map((bidder, index) => {
                    const user = getUserById(bidder.userId);
                    return (
                      <TableRow key={bidder.userId}>
                        <TableCell>
                          <Typography variant="h6" color="primary">
                            #{index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {user?.username[0].toUpperCase() || "?"}
                            </Avatar>
                            <Typography>
                              {user?.username || `User ${bidder.userId}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{bidder.totalBids}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="primary" fontWeight="bold">
                            ${bidder.totalAmount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bidder.wins}
                            color={bidder.wins > 0 ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
};