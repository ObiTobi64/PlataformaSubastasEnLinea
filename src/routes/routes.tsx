import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoutes from "../guards/ProtectedRoutes";
import { Layout } from "../layout/Layout";
import { useTranslation } from "react-i18next";
import Home from "../pages/Home";
import { AuctionInfo } from "../pages/auction/AuctionInfo";
import { BidHistory } from "../pages/user/BidHistory";
import { AdminPanel } from "../pages/admin/AdminPanel";
import { AuctionResults } from "../pages/auction/AuctionResults";
import ErrorComponent from "../components/ErrorComponent";

export const AppRoutes = () => {
  const { t } = useTranslation();
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<ErrorComponent message={t("error.routes")} />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoutes>
                <Layout />
              </ProtectedRoutes>
            }
          >
            <Route path="" element={<Home />} />
            <Route path="auction/:auctionId" element={<AuctionInfo />} />
            <Route path="myBids" element={<BidHistory />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="results" element={<AuctionResults />} />
          </Route>
          <Route
            path="*"
            element={
              <ProtectedRoutes>
                <Layout />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
