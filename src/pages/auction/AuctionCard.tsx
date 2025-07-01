import { Card, CardMedia, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Timer as BaseTimer } from "../../components/Timer";

interface ImageProps {
  src: string;
  alt: string;
}

interface TimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface AuctionCardProps {
  children: ReactNode;
  auctionId: string;
}

export const AuctionCard = ({ children, auctionId }: AuctionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`auction/${auctionId}`);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: 345,
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 3,
        },
      }}
      onClick={handleClick}
    >
      {children}
    </Card>
  );
};

const ImageContainer = ({ children }: { children: ReactNode }) => (
  <Box sx={{ position: "relative" }}>{children}</Box>
);

const Image = ({ src, alt }: ImageProps) => {
  return <CardMedia component="img" height="350" image={src} alt={alt} />;
};

const Timer = (props: TimerProps) => (
  <Box
    sx={{
      position: "absolute",
      bottom: 8,
      left: "50%",
      transform: "translateX(-50%)",
      width: "auto",
      zIndex: 1,
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      paddingX: "16px",
      opacity: 0.9,
    }}
  >
    <BaseTimer {...props} />
  </Box>
);

const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ textAlign: "center" }}
    >
      {children}
    </Typography>
  );
};

const Title = ({ children }: { children: ReactNode }) => {
  return (
    <Typography
      gutterBottom
      variant="h6"
      component="div"
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        mt: 1,
      }}
    >
      {children}
    </Typography>
  );
};

AuctionCard.ImageContainer = ImageContainer;
AuctionCard.Timer = Timer;
AuctionCard.Footer = Footer;
AuctionCard.Title = Title;
AuctionCard.Image = Image;
