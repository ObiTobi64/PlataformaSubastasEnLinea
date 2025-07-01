import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useBidForm } from "../hooks/useBidForm";

export const BidForm = () => {
  const { t } = useTranslation();

  const { formik, currentBid, currentBidUser } = useBidForm();

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("bid.placeBid")}
      </Typography>

      {currentBid && (
        <Box mb={2} p={2} bgcolor="#B9D4AA" borderRadius={1}>
          <Typography variant="subtitle2">{t("bid.currentHighest")}</Typography>
          <Typography variant="h6" color="primary">
            ${currentBid.amount}
          </Typography>
          {currentBidUser && (
            <Typography variant="body2" color="text.secondary">
              {t("bid.by")} {currentBidUser.username}
            </Typography>
          )}
        </Box>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            name="amount"
            label={t("bid.amount")}
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            inputProps={{
              step: "0.01",
              min: 0,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
          >
            {formik.isSubmitting ? t("bid.placing") : t("bid.placeBid")}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};
