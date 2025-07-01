import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useUser } from "../hooks/useUser";
import { useTranslation } from "react-i18next";
import type { IUser } from "../interfaces/IUser";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  editingItem?: IUser | null;
}

export const UserForm = ({ open, onClose, editingItem }: UserFormProps) => {
  const { t } = useTranslation();
  const { formik } = useUser({
    editingItem,
    onSuccess: onClose,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {editingItem ? t("admin.editUser") : t("admin.createUserTitle")}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                name="username"
                label={t("admin.username")}
                value={formik.values.username || ""}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                name="role"
                label={t("admin.role")}
                value={formik.values.role || "user"}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                <option value="user">{t("auth.roleUser")}</option>
                <option value="admin">{t("auth.roleAdmin")}</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t("admin.cancel")}</Button>
          <Button type="submit" variant="contained">
            {editingItem ? t("admin.update") : t("admin.createUser")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
