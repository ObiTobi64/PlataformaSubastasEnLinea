import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Timer = ({ days, hours, minutes, seconds }: TimerProps) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 1,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        {t("timer.title")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {days.toString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("timer.days")}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {hours.toString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("timer.hours")}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {minutes.toString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("timer.minutes")}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {seconds.toString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("timer.seconds")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
