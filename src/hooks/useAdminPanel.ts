import { useState, useEffect } from "react";
import { useAuctionStore } from "../store/useAuctionStore";
import { severities } from "../constants/severities";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../context/SnackbarContext";
import { useUserStore } from "../store/useUserStore";


export const useAdminPanel = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [openAuctionDialog, setOpenAuctionDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [editingAuction, setEditingAuction] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  // ✅ Auction Store
  const auctions = useAuctionStore((state) => state.auctions);
  const deleteAuction = useAuctionStore((state) => state.deleteAuction);
  const fetchAuctions = useAuctionStore((state) => state.fetchAuctions);
  const auctionError = useAuctionStore((state) => state.error);
  const { showMessage } = useSnackbar();

  // ✅ User Store
  const users = useUserStore((state) => state.users);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const userError = useUserStore((state) => state.error);
  useEffect(() => {
    if (auctions.length === 0) {
      fetchAuctions();
    }
    if (users.length === 0) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (auctionError) {
      showMessage(auctionError, severities.ERROR);
    }
  }, [auctionError]);

  useEffect(() => {
    if (userError) {
      showMessage(userError, severities.ERROR);
    }
  }, [userError]);

  // ✅ Calcular estadísticas
  const statistics = {
    totalAuctions: auctions.length,
    totalUsers: users.length,
    activeAuctions: auctions.filter((auction) => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      return endTime > now;
    }).length,
  };
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateAuction = () => {
    setEditingAuction(null);
    setOpenAuctionDialog(true);
  };

  const handleEditAuction = (auction: any) => {
    setEditingAuction(auction);
    setOpenAuctionDialog(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setOpenUserDialog(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setOpenUserDialog(true);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    showMessage(t("admin.userDeleted"), severities.SUCCESS);
  };

  const handleDeleteAuction = (id: string) => {
    deleteAuction(id);
    showMessage(t("admin.auctionDeleted"), severities.SUCCESS);
  };
  return {
    handleEditAuction,
    handleDeleteAuction,
    handleEditUser,
    handleDeleteUser,
    statistics,
    tabValue,
    handleTabChange,
    handleCreateAuction,
    auctions,
    handleCreateUser,
    users,
    openAuctionDialog,
    setOpenAuctionDialog,
    openUserDialog,
    setOpenUserDialog,
    editingAuction,
    editingUser,
  };
};
