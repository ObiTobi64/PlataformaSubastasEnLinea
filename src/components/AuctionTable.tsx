import { Edit, Delete } from "@mui/icons-material";
import { Typography, Box, IconButton } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAuctionStore } from "../store/useAuctionStore";
import type { IAuction } from "../interfaces/IAuction";
import { useTranslation } from "react-i18next";

interface AuctionTableProps {
  handleEditAuction: (auction: IAuction) => void;
  handleDeleteAuction: (auctionId: string) => void;
}
export const AuctionTable = ({
  handleEditAuction,
  handleDeleteAuction,
}: AuctionTableProps) => {
  const auctions = useAuctionStore((state) => state.auctions);
  const { t } = useTranslation();
  const auctionColumns: GridColDef[] = [
    {
      field: "name",
      headerName: t("auction.formName"),
      width: 250,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "basePrice",
      headerName: t("auction.formBasePrice"),
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          ${params.value}
        </Typography>
      ),
    },
    {
      field: "endTime",
      headerName: t("auction.formEndDate"),
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: t("auction.tableActions"),
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEditAuction(params.row)}
            size="small"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteAuction(params.row.id)}
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
      rows={auctions}
      columns={auctionColumns}
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 10 } },
      }}
      disableRowSelectionOnClick
    />
  );
};
