import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Gavel, People, Add, AdminPanelSettings } from "@mui/icons-material";
import { AuctionForm } from "../../components/AuctionForm";
import { UserForm } from "../../components/UserForm";
import { useAdminPanel } from "../../hooks/useAdminPanel";
import { UserTable } from "../../components/UserTable";
import { AuctionTable } from "../../components/AuctionTable";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const TabPanel = ({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const AdminPanel = () => {
  const { t } = useTranslation();
  const {
    handleDeleteAuction,
    handleEditAuction,
    handleDeleteUser,
    handleEditUser,
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
  } = useAdminPanel();

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "",
    itemName: "",
    onConfirm: () => {},
  });

  const confirmDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setDeleteDialog({
      open: true,
      type: "user",
      itemName: user?.username || "",
      onConfirm: () => {
        handleDeleteUser(userId);
        setDeleteDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const confirmDeleteAuction = (auctionId: string) => {
    const auction = auctions.find((a) => a.id === auctionId);
    setDeleteDialog({
      open: true,
      type: "auction",
      itemName: auction?.name || "",
      onConfirm: () => {
        handleDeleteAuction(auctionId);
        setDeleteDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  return (
    <Box p={3}>
      <link
        rel="stylesheet"
        href="https://horizon-tailwind-react-corporate-7s21b54hb-horizon-ui.vercel.app/static/css/main.d7f96858.css"
      />

      <div className="h-auto bg-gray-50 flex items-center fade-in ">
        <section className="w-full bg-cover bg-center py-32 relative" style={{ backgroundImage: 'url(https://img.freepik.com/vector-premium/fondo-banner-diseno-portada-web-redes-sociales_906484-6.jpg)' }}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto text-center text-white relative z-10">
           <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main", m: 5 }}
          >
            {t("admin.title")}
          </Typography>
          </div>
        </section>
      </div>

    

      {/* Statistics */}
      <div className="min-w-[375px] md:min-w-[700px] xl:min-w-[800px] mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <Gavel />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("admin.totalAuctions")}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {statistics.totalAuctions}
            </h4>
          </div>
        </div>

        <div className="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <People />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("admin.totalUsers")}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {statistics.totalUsers}
            </h4>
          </div>
        </div>

        <div className="relative flex flexGrowth !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <span className="flex items-center text-brand-500 dark:text-white">
                <AdminPanelSettings />
              </span>
            </div>
          </div>
          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600">
              {t("admin.activeAuctions")}
            </p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              {statistics.activeAuctions}
            </h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card elevation={2}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t("admin.manageAuctions")} />
          <Tab label={t("admin.manageUsers")} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {t("admin.manageAuctions")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateAuction}
              >
                {t("admin.createAuction")}
              </Button>
            </Box>

            <Box sx={{ height: 400, width: "100%" }}>
              <AuctionTable
                handleDeleteAuction={confirmDeleteAuction}
                handleEditAuction={handleEditAuction}
              />
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {t("admin.manageUsers")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateUser}
              >
                {t("admin.createUser")}
              </Button>
            </Box>

            <Box sx={{ height: 400, width: "100%" }}>
              <UserTable
                handleDeleteUser={confirmDeleteUser}
                handleEditUser={handleEditUser}
              />
            </Box>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Dialogs */}
      <AuctionForm
        open={openAuctionDialog}
        onClose={() => setOpenAuctionDialog(false)}
        editingItem={editingAuction}
      />

      <UserForm
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        editingItem={editingUser}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>{t("admin.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("admin.deleteMessage")} "{deleteDialog.itemName}"? {t("admin.deleteAction")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialog((prev) => ({ ...prev, open: false }))
            }
          >
            {t("admin.cancel")}
          </Button>
          <Button
            onClick={deleteDialog.onConfirm}
            color="error"
            variant="contained"
          >
            {t("admin.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};