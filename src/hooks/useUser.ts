import { useFormik } from "formik";
import * as Yup from "yup";
import type { IUser } from "../interfaces/IUser";
import { severities } from "../constants/severities";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../context/SnackbarContext";
import { useUserStore } from "../store/useUserStore";

interface UseUserProps {
  editingItem?: IUser | null;
  onSuccess?: () => void;
}

export const useUser = ({ editingItem, onSuccess }: UseUserProps = {}) => {
  const { showMessage } = useSnackbar();
  const createUser = useUserStore((state) => state.createUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const error = useUserStore((state) => state.error);
  const { t } = useTranslation();

  const userSchema = Yup.object({
    username: Yup.string()
      .min(3, t("forms.minLength", { min: 3 }))
      .max(30, t("forms.maxLength", { max: 30 }))
      .required(t("forms.required")),
    role: Yup.string()
      .oneOf(["user", "admin"], t("forms.invalidRole"))
      .required(t("forms.required")),
  });

  useEffect(() => {
    if (error) {
      showMessage(error, severities.ERROR);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: editingItem || ({} as IUser),
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: (values: IUser) => {
      if (editingItem) {
        updateUser({ id: editingItem.id, ...values });
        showMessage(t("admin.userUpdated"), severities.SUCCESS);
      } else {
        createUser(values);
        showMessage(t("admin.userCreated"), severities.SUCCESS);
      }

      onSuccess?.();
      formik.resetForm();
    },
  });

  return {
    formik,
    isEditing: !!editingItem,
  };
};
