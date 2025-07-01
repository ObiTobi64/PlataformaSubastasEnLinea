import { useEffect } from "react";
import { Box, Typography, Grid, Chip } from "@mui/material";
import { useAuctionStore } from "../store/useAuctionStore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GavelIcon from "@mui/icons-material/Gavel";
import EventIcon from "@mui/icons-material/Event";
import { useBidStore } from "../store/useBidStore"; // ✅ Importar BidStore
import { useTranslation } from "react-i18next";
import { AuctionCard } from "./auction/AuctionCard";
import { useAppWebSocket } from "../hooks/useWebSocket";
import { auctionTypes } from "../constants/auctionTypes";
import { useUserStore } from "../store/useUserStore";

function Home() {
  const auctions = useAuctionStore((state) => state.auctions);
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);

  // ✅ Usar BidStore en lugar de currentBids del WebSocket
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);
  const getUserById = useUserStore((state) => state.getUserById);

  const { t } = useTranslation();
  const { timers } = useAppWebSocket(); // ✅ Solo timers del WebSocket

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <Box p={3}>
      
      <div className="h-auto bg-gray-50 flex items-center fade-in ">
        <section className="w-full bg-cover bg-center py-32 relative " style={{ backgroundImage: 'url(https://t3.ftcdn.net/jpg/02/09/56/68/360_F_209566861_wbhyfU0heSiEcTthT09a6fr6HXHBLRi7.jpg)' }}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto text-center text-white relative z-10">
           <Typography
              variant="h3"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main", mb: 5 , p: 7 ,backgroundColor: "rgba(46, 90, 73, 0.03)", borderRadius: "8px" } }
            >
              {t("home.title")}
            </Typography>
          </div>
        </section>
      </div>
    

      {auctions.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            {t("home.noAuctions")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {auctions.map((auction) => {
            const timer = timers[auction.id];
            const currentBid = getCurrentBid(auction.id.toString());
            const latestBidder = getUserById(currentBid?.userId || "");

            return (
              <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={auction.id}>
                <AuctionCard auctionId={auction.id}>
                  <AuctionCard.ImageContainer>
                    <AuctionCard.Image
                      src={auction.img || "https://picsum.photos/300/200"}
                      alt={auction.name}
                    />
                    {timer && timer.type === auctionTypes.PRESENT && (
                      <AuctionCard.Timer
                        days={timer.timeLeft.days}
                        hours={timer.timeLeft.hours}
                        minutes={timer.timeLeft.minutes}
                        seconds={timer.timeLeft.seconds}
                      />
                    )}
                  </AuctionCard.ImageContainer>

                  <Box
                    p={2}
                    sx={{ textAlign: "center", borderTop: "1px solid #eee" }}
                  >
                    <AuctionCard.Title>{auction.name}</AuctionCard.Title>

                    <AuctionCard.Footer>
                      {(() => {
                        if (!timer) return null;

                        let label = "";
                        let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
                        let icon = null;

                        switch (timer.type) {
                          case auctionTypes.PRESENT:
                            icon = <GavelIcon />;
                            color = "success";
                            label = currentBid
                              ? `${t("home.currentBid")} $${currentBid.amount.toFixed(2)}`
                              : `${t("home.basePrice")} $${auction.basePrice.toFixed(2)}`;
                            break;

                          case auctionTypes.PAST:
                            icon = <AccessTimeIcon />;
                            color =  "error" ;
                            label = latestBidder
                              ? `${t("home.soldFor")} $${currentBid!.amount.toFixed(2)}`
                              : t("home.pastAuction");
                            break;

                          case auctionTypes.FUTURE:
                            icon = <EventIcon />;
                            color = "info";
                            label = t("home.futureAuction");
                            break;

                          default:
                            return null;
                        }

                        return <Chip icon={icon} label={label} color={color} />;
                      })()}
                    </AuctionCard.Footer>
                  </Box>
                </AuctionCard>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

export default Home;
