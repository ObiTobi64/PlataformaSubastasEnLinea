import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
  Paper,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  EmojiEvents,
} from "@mui/icons-material";
import { useState } from "react";

import { useAuctionStore } from "../../store/useAuctionStore";
import { useBidStore } from "../../store/useBidStore";
import { useAppWebSocket } from "../../hooks/useWebSocket";
import { useUserStore } from "../../store/useUserStore";
import { useAuth } from "../../context/AuthContext";

import { AuctionStateRenderer } from "../../components/AuctionStateRenderer";
import { Timer } from "../../components/Timer";
import { BidForm } from "../../components/BidForm";
import { AuctionChat } from "../../components/AuctionChat";

export const AuctionInfo = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { auctionId } = useParams<{ auctionId: string }>();

  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);
  const getUserById = useUserStore((state) => state.getUserById);
  const { timers } = useAppWebSocket();

  const [chatOpen, setChatOpen] = useState(false);

  if (!auctionId) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          {t("bid.invalidAuction")}
        </Typography>
      </Box>
    );
  }

  const auction = getAuctionById(auctionId);
  if (!auction) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="error">
          {t("auth.auctionNotFound")}
        </Typography>
      </Box>
    );
  }

  const currentBid = getCurrentBid(auctionId);
  const bidUser = getUserById(currentBid?.userId || "");
  const timer = timers[auction.id];

  return (
    <AuctionStateRenderer auction={auction} timer={timer}>
      {(auction, state, timeInfo) => (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={auction.img || "https://picsum.photos/500"}
                alt={auction.name}
                sx={{
                  width: "100%",
                  height: 300,
                  objectFit: "contain",
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              />
            </Grid>

            <Grid item xs={12} md={7}>
              <Typography variant="h5" fontWeight="bold">
                {auction.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {auction.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2}>
                {timeInfo.isUpcoming && (
                  <Chip label={t("auction.upcoming")} color="info" />
                )}
                {timeInfo.isActive && (
                  <Chip label={t("auction.active")} color="success" />
                )}
                {timeInfo.isEnded && (
                  <Chip  label={t("auction.ended")} color="error" />
                )}
              </Stack>

              {timeInfo.timeLeft && (
                <Box mt={2}>
                  <Timer
                    days={timeInfo.timeLeft.days}
                    hours={timeInfo.timeLeft.hours}
                    minutes={timeInfo.timeLeft.minutes}
                    seconds={timeInfo.timeLeft.seconds}
                  />
                </Box>
              )}

              {timeInfo.isUpcoming && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t("auction.startsAt")}:{" "}
                  {new Date(auction.startTime).toLocaleString()}
                </Alert>
              )}

              {timeInfo.isEnded && (
                <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                  <Typography variant="h6" color="text.primary">
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
                    <>
                      <Typography color="success.main">
                        {t("bid.winner")}: {bidUser.username || bidUser.id}
                      </Typography>
                      <Typography color="primary">
                        {t("bid.finalPrice")}: ${currentBid.amount.toLocaleString()}
                      </Typography>
                      {user?.id === bidUser.id && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                          🎉 {t("bid.congratulations")} {t("bid.youWon")}
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      {t("bidHistory.noBids")}
                    </Typography>
                  )}
                </Paper>
              )}

              <Box mt={2}>
                <Typography variant="body1">
                  <strong>{t("home.basePrice")}:</strong>{" "}
                  <span style={{ color: "#1976d2", fontWeight: 600 }}>
                    ${auction.basePrice.toLocaleString()}
                  </span>
                </Typography>

                {currentBid && !timeInfo.isEnded && (
                  <Box
                    mt={1}
                    p={2}
                    bgcolor="#e6f4ea"
                    border="1px solid #a5d6a7"
                    borderRadius={2}
                  >
                    <Typography variant="subtitle1" color="success.main">
                      {t("home.currentBid")}:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${currentBid.amount.toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Box>

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
            </Grid>
          </Grid>

          {!timeInfo.isEnded && !timeInfo.isUpcoming && (
            <>
              <Button
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => setChatOpen((prev) => !prev)}
              >
                {chatOpen ? "Ocultar Chat" : "Mostrar Chat"}
              </Button>
              <AuctionChat
                auctionId={auction.id}
                username={user?.username || "Invitado"}
                open={chatOpen}
                onClose={() => setChatOpen(false)}
              />
            </>
          )}
        </Box>
      )}
    </AuctionStateRenderer>
  );
};
