import {
  Box,
  Typography,
  Card,
  CardContent,
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
            {t("bidHistory.title") || "My Bid History"}
          </Typography>
          </div>
        </section>
      </div>

      

      <div className="min-w-[375px] md:min-w-[700px] xl:min-w-[800px] mt-3 grid mb-5 grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
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
              {t("bidHistory.totalBids") || "Total Bids"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {statistics.totalBids}
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
              {t("bidHistory.auctionsWon") || "Auctions Won"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {statistics.auctionsWon}
            </h4>
          </div>
        </div>

        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <AccountBalance />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("bidHistory.totalSpent") || "Total Spent"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              ${statistics.totalSpent.toFixed(2)}
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
              {t("bidHistory.averageBid") || "Average Bid"}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              ${statistics.averageBid.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

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