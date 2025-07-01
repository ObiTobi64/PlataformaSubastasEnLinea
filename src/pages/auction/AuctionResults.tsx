import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
import { auctionTypes } from "../../constants/auctionTypes";

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
      <Typography
        variant="h3"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        {t("results.title") || "Auction Results & Statistics"}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "primary.main" }}>
                <Timeline />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.totalAuctions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("results.totalAuctions") || "Total Auctions"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "success.main" }}>
                <EmojiEvents />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.completedAuctions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("results.completedAuctions") || "Completed"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "success.main" }}>
                <EmojiEvents />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.completedAuctions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("results.completedAuctions") || "Completed"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "info.main" }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ${stats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("results.totalRevenue") || "Total Revenue"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "warning.main" }}>
                <People />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {stats.totalParticipants}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("results.participants") || "Participants"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Tabs */}
      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t("results.allAuctions") || "All Auctions"} />
          <Tab label={t("results.topBidders") || "Top Bidders"} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CardContent>
            {/* ✅ Filter */}
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

            {/* ✅ Auctions Table */}
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
