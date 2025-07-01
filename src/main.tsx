import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@mui/material/styles";
import './index.css'
import App from './App.tsx'
import "./i18n/i18n.ts";
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import theme from './theme.ts';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
    <SnackbarProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>
);
