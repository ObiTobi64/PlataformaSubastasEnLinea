import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ErrorComponent = ({ message }: { message?: string }) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <Typography variant="h4" color="error">
        {message || t("error.generic")}
      </Typography>
      {/* <Button variant="contained" onClick={() => }>
        Recargar página
      </Button> */}
    </Box>
  );
};

export default ErrorComponent;
