import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  TrendingUp,
  EmojiEvents,
  AccountBalance,
  Timeline,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useBidHistory } from "../../hooks/useBidHistory";

export const BidHistory = () => {
  const { t } = useTranslation();
  const { userBids, statistics, loading, error, getAuctionInfo } =
    useBidHistory();

  const columns: GridColDef[] = [
    {
      field: "auctionName",
      headerName: t("bidHistory.auction") || "Auction",
      width: 300,
      renderCell: (params) => (
        <Box mt={2}>
          <Typography variant="body1" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: t("bidHistory.amount") || "Amount",
      width: 150,
      renderCell: (params) => (
        <Typography
          variant="h6"
          color="primary.main"
          sx={{ fontWeight: "bold", marginTop: 1 }}
        >
          ${params.value}
        </Typography>
      ),
    },
    {
      field: "timestamp",
      headerName: t("bidHistory.time"),
      width: 200,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginTop: 2 }}
        >
          {new Date(params.value).toLocaleString("es-es") || "N/A"}
        </Typography>
      ),
    },
  ];

  const rows = userBids.map((bid) => {
    const auction = getAuctionInfo(bid.auctionId);
    return {
      id: bid.id,
      auctionId: bid.auctionId,
      auctionName: auction?.name || `Auction ${bid.auctionId}`,
      amount: bid.amount,
      timestamp: bid.timestamp,
    };
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        {t("bidHistory.title") || "My Bid History"}
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "primary.main" }}>
                <Timeline />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {statistics.totalBids}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("bidHistory.totalBids") || "Total Bids"}
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
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {statistics.auctionsWon}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("bidHistory.auctionsWon") || "Auctions Won"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "info.main" }}>
                <AccountBalance />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ${statistics.totalSpent.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("bidHistory.totalSpent") || "Total Spent"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "warning.main" }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                ${statistics.averageBid.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("bidHistory.averageBid") || "Average Bid"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* DataGrid */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {t("bidHistory.recentBids") || "Recent Bids"}
          </Typography>

          {userBids.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Timeline sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("bidHistory.noBids") || "No bids found"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("bidHistory.startBidding") ||
                  "Start participating in auctions to see your history here"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                disableRowSelectionOnClick
                sx={{
                  "& .MuiDataGrid-cell:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
