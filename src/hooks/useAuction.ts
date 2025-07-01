import { useFormik } from "formik";
import * as Yup from "yup";
import type { IAuction } from "../interfaces/IAuction";
import { useAuctionStore } from "../store/useAuctionStore";
import { severities } from "../constants/severities";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../context/SnackbarContext";
interface useActionProps {
  editingItem?: IAuction;
  onSuccess: () => void;
}
export const useAction = ({ editingItem, onSuccess }: useActionProps) => {
  const { t } = useTranslation();
  const { showMessage } = useSnackbar();
  const createAuction = useAuctionStore((state) => state.createAuction);
  const updateAuction = useAuctionStore((state) => state.updateAuction);
  const error = useAuctionStore((state) => state.error);
  const auctionSchema = Yup.object({
    name: Yup.string().required(t("forms.required")),
    description: Yup.string().required(t("forms.required")),
    basePrice: Yup.number()
      .min(1, t("forms.minPrice", { min: 1 }))
      .required(t("forms.required")),
    startTime: Yup.string().required(t("forms.required")),
    endTime: Yup.string().required(t("forms.required")),
  });

  useEffect(() => {
    if (error) {
      showMessage(error, severities.ERROR);
    }
  }, [error]);

  const formik = useFormik({
    initialValues: editingItem ? editingItem : ({} as IAuction),
    validationSchema: auctionSchema,
    enableReinitialize: true,
    onSubmit: async (values: IAuction) => {
      if (editingItem) {
        updateAuction({ id: editingItem.id, ...values });
        showMessage(t("admin.auctionUpdated"), severities.SUCCESS);
      } else {
        createAuction(values);
        showMessage(t("admin.auctionCreated"), severities.SUCCESS);
      }
      onSuccess();
      formik.resetForm();
    },
  });

  return {
    formik,
  };
};
