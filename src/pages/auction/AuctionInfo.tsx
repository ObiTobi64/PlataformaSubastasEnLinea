import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardMedia, Chip, Alert } from "@mui/material";
import { BidForm } from "../../components/BidForm";
import { Timer } from "../../components/Timer";
import { useAppWebSocket } from "../../hooks/useWebSocket";
import { useAuctionStore } from "../../store/useAuctionStore";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store/useUserStore";
import { useBidStore } from "../../store/useBidStore";
import { AuctionStateRenderer } from "../../components/AuctionStateRenderer";
import {
  AccessTime,
  EmojiEvents,
  Schedule,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export const AuctionInfo = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { auctionId } = useParams<{ auctionId: string }>();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getUserById = useUserStore((state) => state.getUserById);
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);
  const { timers } = useAppWebSocket();

  if (!auctionId) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {t("bid.invalidAuction")}
        </Typography>
      </Box>
    );
  }

  const auction = getAuctionById(auctionId);
  if (!auction) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {t("auth.auctionNotFound")}
        </Typography>
      </Box>
    );
  }

  const timer = timers[auction.id];
  const currentBid = getCurrentBid(auctionId);
  const bidUser = getUserById(currentBid?.userId || "");

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={auction.img || "https://picsum.photos/800/400"}
          alt={auction.name}
        />

        {/* ✅ Render Props - Información basada en estado */}
        <AuctionStateRenderer auction={auction} timer={timer}>
          {(auction, state, timeInfo) => (
            <Box p={3}>
              {/* ✅ Header con estado */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Box flex={1}>
                  <Typography variant="h4" gutterBottom>
                    {auction.name}
                  </Typography>
                </Box>

                {/* ✅ Estado visual según Render Props */}
                <Box>
                  {timeInfo.isUpcoming && (
                    <Chip
                      icon={<Schedule />}
                      label={t("auction.upcoming")}
                      color="info"
                      variant="filled"
                    />
                  )}
                  {timeInfo.isActive && (
                    <Chip
                      icon={<PlayArrow />}
                      label={t("auction.active")}
                      color="success"
                      variant="filled"
                    />
                  )}
                  {timeInfo.isEnded && (
                    <Chip
                      icon={<Stop />}
                      label={t("auction.ended")}
                      color="error"
                      variant="filled"
                    />
                  )}
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" paragraph>
                {auction.description}
              </Typography>

              {timeInfo.isUpcoming && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
                    {t("auction.startsAt")}:{" "}
                    {new Date(auction.startTime).toLocaleString()}
                  </Typography>
                </Alert>
              )}

              {timeInfo.isActive && timeInfo.timeLeft && (
                <Timer
                  days={timeInfo.timeLeft.days}
                  hours={timeInfo.timeLeft.hours}
                  minutes={timeInfo.timeLeft.minutes}
                  seconds={timeInfo.timeLeft.seconds}
                />
              )}

              {timeInfo.isEnded && (
                <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                  <Typography variant="h5" color="text.primary" gutterBottom>
                    <EmojiEvents
                      sx={{
                        mr: 1,
                        verticalAlign: "middle",
                        color: "warning.main",
                      }}
                    />
                    {t("bid.auctionEnded")}
                  </Typography>

                  {currentBid && bidUser ? (
                    <Box>
                      <Typography variant="h6" color="success.main">
                        {t("bid.winner")}: {bidUser.username || bidUser.id}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {t("bid.finalPrice")}: $
                        {currentBid.amount.toLocaleString()}
                      </Typography>

                      {/* ✅ Mensaje personalizado si el usuario ganó */}
                      {user?.id === bidUser.id && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                          🎉 {t("bid.congratulations")} {t("bid.youWon")}
                        </Alert>
                      )}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      {t("bidHistory.noBids")}
                    </Typography>
                  )}
                </Box>
              )}

              {/* ✅ Información de precios */}
              <Box display="flex" gap={3} my={2}>
                <Typography variant="h6" gutterBottom>
                  {t("home.basePrice")}:
                  <Typography
                    component="span"
                    color="primary"
                    fontWeight="bold"
                    ml={1}
                  >
                    ${auction.basePrice.toLocaleString()}
                  </Typography>
                </Typography>

                {currentBid && !timeInfo.isEnded && (
                  <Typography variant="h6" gutterBottom>
                    {t("home.currentBid")}:
                    <Typography
                      component="span"
                      color="success.main"
                      fontWeight="bold"
                      ml={1}
                    >
                      ${currentBid.amount.toLocaleString()}
                    </Typography>
                  </Typography>
                )}
              </Box>

              {/* ✅ Formulario de ofertas - solo si está activa */}
              {timeInfo.isActive && (
                <Box mt={3}>
                  <BidForm />
                </Box>
              )}

              {/* ✅ Mensajes informativos según estado */}
              {timeInfo.isUpcoming && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {t("auction.waitingToStart")}
                </Alert>
              )}

              {timeInfo.isEnded && !user && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t("auction.loginToSeeResults")}
                </Alert>
              )}
            </Box>
          )}
        </AuctionStateRenderer>
      </Card>
    </Box>
  );
};
