import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  Alert,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  EmojiEvents,
  Schedule,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

import { BidForm } from "../../components/BidForm";
import { Timer } from "../../components/Timer";
import { AuctionChat } from "../../components/AuctionChat";
import { AuctionStateRenderer } from "../../components/AuctionStateRenderer";
import { useAppWebSocket } from "../../hooks/useWebSocket";
import { useAuctionStore } from "../../store/useAuctionStore";
import { useUserStore } from "../../store/useUserStore";
import { useBidStore } from "../../store/useBidStore";
import { useAuth } from "../../context/AuthContext";

export const AuctionInfo = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { auctionId } = useParams<{ auctionId: string }>();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getUserById = useUserStore((state) => state.getUserById);
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);
  const { timers } = useAppWebSocket();
  const [chatOpen, setChatOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <AuctionStateRenderer auction={auction} timer={timer}>
      {(auction, state, timeInfo) => (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 4, position: "relative" }}>
          <Stack spacing={4}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={auction.img || "https://picsum.photos/800/400"}
                alt={auction.name}
              />
              <Box p={3}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                  mb={2}
                >
                  <Typography variant="h4" fontWeight={600}>
                    {auction.name}
                  </Typography>

                  <Chip
                    icon={
                      timeInfo.isUpcoming ? <Schedule /> :
                      timeInfo.isActive ? <PlayArrow /> : <Stop />
                    }
                    label={
                      timeInfo.isUpcoming
                        ? t("auction.upcoming")
                        : timeInfo.isActive
                        ? t("auction.active")
                        : t("auction.ended")
                    }
                    color={
                      timeInfo.isUpcoming
                        ? "info"
                        : timeInfo.isActive
                        ? "success"
                        : "error"
                    }
                    size="medium"
                    sx={{ fontWeight: "bold" }}
                  />
                </Stack>

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
                  <Box
                    mt={3}
                    p={3}
                    borderRadius={2}
                    sx={{
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
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
                          {t("bid.finalPrice")}: ${currentBid.amount.toLocaleString()}
                        </Typography>

                        {user?.id === bidUser.id && (
                          <Alert severity="success" sx={{ mt: 2 }}>
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

                <Stack direction={{ xs: "column", sm: "row" }} spacing={4} my={3}>
                  <Typography variant="h6">
                    {t("home.basePrice")}:{" "}
                    <Box component="span" color="primary.main" fontWeight="bold">
                      ${auction.basePrice.toLocaleString()}
                    </Box>
                  </Typography>

                  {currentBid && !timeInfo.isEnded && (
                    <Typography variant="h6">
                      {t("home.currentBid")}:{" "}
                      <Box component="span" color="success.main" fontWeight="bold">
                        ${currentBid.amount.toLocaleString()}
                      </Box>
                    </Typography>
                  )}
                </Stack>

                {timeInfo.isActive && (
                  <Box mt={3}>
                    <BidForm />
                  </Box>
                )}

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
            </Card>

            {!timeInfo.isEnded && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    position: "fixed",
                    bottom: 80,
                    right: 16,
                    zIndex: 1301,
                    borderRadius: "20px",
                    boxShadow: 3,
                    px: 2,
                  }}
                  onClick={() => setChatOpen((v) => !v)}
                >
                  {chatOpen ? "🗙 Chat" : "💬 Chat"}
                </Button>

                <AuctionChat
                  auctionId={auction.id}
                  username={user?.username || "Invitado"}
                  open={chatOpen}
                  onClose={() => setChatOpen(false)}
                />
              </>
            )}
          </Stack>
        </Box>
      )}
    </AuctionStateRenderer>
  );
};
