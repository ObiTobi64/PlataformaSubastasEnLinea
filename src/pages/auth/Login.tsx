import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLogin } from "../../hooks/useLogin";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formik } = useLogin();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Box textAlign="center" mb={3}>
          <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "primary.main" }} />
          <Typography variant="h4" component="h1">
            {t("auth.loginTitle")}
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            name="username"
            label={t("auth.username")}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {t("auth.loginButton")}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/register")}
          >
            {t("auth.noAccount")}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
