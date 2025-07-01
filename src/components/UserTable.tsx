import { Edit, Delete } from "@mui/icons-material";
import { Typography, Box, IconButton } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useUserStore } from "../store/useUserStore";
import { useTranslation } from "react-i18next";

interface UserTableProps {
  handleEditUser: (user: any) => void;
  handleDeleteUser: (userId: string) => void;
}

export const UserTable = ({
  handleDeleteUser,
  handleEditUser,
}: UserTableProps) => {
  const { t } = useTranslation();
  const users = useUserStore((state) => state.users);
  
  const userColumns: GridColDef[] = [
    {
      field: "username",
      headerName: t("admin.username"),
      width: 200,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: t("admin.role"),
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color={params.value === "admin" ? "error.main" : "text.secondary"}
          fontWeight={params.value === "admin" ? "bold" : "normal"}
        >
          {params.value === "admin" ? t("auth.roleAdmin") : t("auth.roleUser")}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: t("admin.actions"),
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditUser(params.row)} size="small">
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteUser(params.row.id)}
            size="small"
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={users}
      columns={userColumns}
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 10 } },
      }}
      disableRowSelectionOnClick
    />
  );
};
