import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { severities } from "../constants/severities";
import { checkLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

const loginSchema = Yup.object({
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder los 30 caracteres")
    .required("El nombre de usuario es requerido"),
});

interface LoginFormValues {
  username: string;
}
export const useLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { showMessage } = useSnackbar();
  const formik = useFormik({
    initialValues: { username: "admin" },
    validationSchema: loginSchema,
    onSubmit: async (values: LoginFormValues) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const res = await checkLogin(values.username);
      if (!res) {
        showMessage(t("auth.notFound"), severities.ERROR);
        return;
      }
      login(res);

      showMessage(t("auth.success"), severities.SUCCESS);
      navigate("/app", { replace: true });
    } catch (error) {
      showMessage(t("auth.errorGeneric"), severities.ERROR);
    }
    formik.resetForm();
  };
  return { formik };
};
