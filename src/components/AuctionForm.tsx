import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useAction } from "../hooks/useAuction";
import { useTranslation } from "react-i18next";

interface AuctionFormProps {
  open: boolean;
  onClose: () => void;
  editingItem: any;
}

export const AuctionForm = ({
  open,
  onClose,
  editingItem,
}: AuctionFormProps) => {
  const { formik } = useAction({
    editingItem,
    onSuccess: onClose,
  });
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {editingItem ? t("auction.edit") : t("auction.create")}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                name="name"
                label={t("auction.formName")}
                value={formik.values.name || ""}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label={t("auction.formDescription")}
                value={formik.values.description || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                name="basePrice"
                label={t("auction.formBasePrice")}
                value={formik.values.basePrice || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.basePrice && Boolean(formik.errors.basePrice)
                }
                helperText={formik.touched.basePrice && formik.errors.basePrice}
              />
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <TextField
                fullWidth
                type="datetime-local"
                name="startTime"
                label={t("auction.formStartTime")}
                value={formik.values.startTime || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.startTime && Boolean(formik.errors.startTime)
                }
                helperText={formik.touched.startTime && formik.errors.startTime}
              />
            </Grid>
            <Grid sx={{ xs: 6 }}>
              <TextField
                fullWidth
                type="datetime-local"
                name="endTime"
                label={t("auction.formEndTime")}
                value={formik.values.endTime || ""}
                onChange={formik.handleChange}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t("auction.formCancel")}</Button>
          <Button type="submit" variant="contained">
            {editingItem ? t("auction.formUpdate") : t("auction.formSubmit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
