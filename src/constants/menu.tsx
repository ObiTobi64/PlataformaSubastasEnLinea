import { Home, Logout, ManageAccounts, Timeline } from "@mui/icons-material";
import HistoryIcon from '@mui/icons-material/History';
import AssignmentIcon from '@mui/icons-material/Assignment';
import type { TFunction } from "i18next";
import type { IUser } from "../interfaces/IUser";


export const getMenu = (t: TFunction, logout: () => void, user: IUser) => [
  {
    title: t("sidebar.home"),
    icon: <Home />,
    path: "/app",
  },
  {
    title: t("sidebar.bidHistory"),
    icon: <HistoryIcon />,
    path: "/app/myBids",
  },
  {
    title: t("sidebar.results"),
    icon: <AssignmentIcon />,
    path: "/app/results",
  },
  ...(user.role === "admin"
    ? [
        {
          title: t("sidebar.panelAdmin"),
          icon: <ManageAccounts />,
          path: "/app/admin",
        },
      ]
    : []),
  {
    title: t("sidebar.logout"),
    icon: <Logout />,
    path: "/login",
    onClick: logout,
  },
];
