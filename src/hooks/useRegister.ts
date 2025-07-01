import * as Yup from "yup";
import { useFormik } from "formik";
import { severities } from "../constants/severities";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";
import { useSnackbar } from "../context/SnackbarContext";
import { useAuth } from "../context/AuthContext";

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder los 30 caracteres")
    .required("El nombre de usuario es requerido"),
  role: Yup.string()
    .oneOf(["user", "admin"], "Rol inválido")
    .required("El rol es requerido"),
  avatar: Yup.string().url("Debe ser una URL válida").optional(),
});

interface RegisterFormValues {
  username: string;
  role: string;
  avatar?: string;
}

export const useRegister = () => {
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      role: "",
      avatar: "https://picsum.photos/200",
    },
    validationSchema: registerSchema,
    onSubmit: async (values: RegisterFormValues) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const res = await createUser({
        id: new Date().getTime().toString(),
        ...values,
      });
      if (!res) {
        showMessage(t("auth.registerError"), severities.ERROR);
        return;
      }

      login(res);
      showMessage(t("auth.registerSuccess"), severities.SUCCESS);
      navigate("/app", { replace: true });
    } catch (error) {
      showMessage(t("auth.errorGeneric"), severities.ERROR);
    }
    formik.resetForm();
  };
  return { formik };
};
