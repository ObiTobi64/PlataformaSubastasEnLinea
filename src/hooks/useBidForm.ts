import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useAppWebSocket } from "./useWebSocket";
import { useTranslation } from "react-i18next";
import { useAuctionStore } from "../store/useAuctionStore";
import { severities } from "../constants/severities";
import { createBid } from "../services/bidService";
import { useSnackbar } from "../context/SnackbarContext";
import { useAuth } from "../context/AuthContext";
import { useBidStore } from "../store/useBidStore";
import { useUserStore } from "../store/useUserStore";

interface BidFormValues {
  amount: string;
}

export const useBidForm = () => {
  const getUserById = useUserStore((state) => state.getUserById);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { placeBid, bidError } = useAppWebSocket();
  const { showMessage } = useSnackbar();
  const getAuctionById = useAuctionStore((state) => state.getAuctionById);
  const getCurrentBid = useBidStore((state) => state.getCurrentBid);

  const auction = getAuctionById(auctionId || "");
  const currentBid = getCurrentBid(auctionId || "");

  const currentBidUser = currentBid
    ? getUserById(currentBid.userId)
    : undefined;

  const minimumBid = currentBid
    ? currentBid.amount + 0.01
    : auction?.basePrice || 0;

  const bidSchema = Yup.object({
    amount: Yup.number()
      .required(t("bid.amountRequired"))
      .positive(t("bid.positiveAmount"))
      .min(minimumBid, `${t("bid.minimumBid")} $${minimumBid}`),
  });

  const formik = useFormik({
    initialValues: { amount: "" },
    validationSchema: bidSchema,
    enableReinitialize: true,
    onSubmit: async (values: BidFormValues) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: BidFormValues) => {
    if (!auctionId || !user?.id) {
      showMessage(t("bid.loginRequired"), severities.ERROR);
      return;
    }

    if (!auction) {
      showMessage(t("bid.auctionNotFound"), severities.ERROR);
      return;
    }

    try {
      const bidAmount = parseFloat(values.amount);

      placeBid(auctionId, bidAmount, user.id);

      await createBid({
        auctionId,
        amount: bidAmount,
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      showMessage(t("bid.success"), severities.SUCCESS);
      formik.resetForm();
    } catch (error) {
      console.error("Error placing bid:", error);
      showMessage(t("bid.error"), severities.ERROR);
    }
  };

  return {
    formik,
    bidError,
    minimumBid,
    auction,
    currentBid,
    currentBidUser,
  };
};
