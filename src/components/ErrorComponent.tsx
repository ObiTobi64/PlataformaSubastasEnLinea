import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ErrorComponent = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f9fafb" // equivalente a bg-gray-50
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box
          flex={1}
          mx={isMobile ? 0 : 4}
          mb={isMobile ? 4 : 0}
          display="flex"
          flexDirection="column"
          alignItems={isMobile ? "center" : "flex-start"}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: "success.main",
              fontSize: { xs: "4rem", md: "6rem" },
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography variant="h5" fontWeight={300} mb={3}>
            {message || t("error.generic")}
          </Typography>

          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 500,
              backgroundColor: "success.main",
              "&:hover": {
                backgroundColor: "error.main",
              },
            }}
            onClick={() => navigate("/app")}
          >
            {t("error.backHome") || "Back to homepage"}
          </Button>
        </Box>

        <Box flex={1} display="flex" justifyContent="center">
          <img
            src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
            alt="Page not found"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorComponent;
