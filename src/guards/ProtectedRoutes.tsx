import { Navigate } from "react-router-dom";
import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { severities } from "../constants/severities";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContext";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();
  const { showMessage } = useSnackbar();
  const { t } = useTranslation();
  // TODO: DONT SHOW MESSAGE ON LOGOUT
  const logoutMessage = useRef(false);

  useEffect(() => {
    if (!isAuth && !logoutMessage.current) {
      showMessage(t("snackbar.noSession"), severities.WARNING);
      logoutMessage.current = true;
    }
  }, [isAuth]);

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
