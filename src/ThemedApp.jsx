import { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { useSiteSettings } from "./providers/SiteSettingsProvider";

import { ProductProvider } from "./providers/ProductProvider";
import { RequestProvider } from "./providers/RequestProvider";
import { CartProvider } from "./providers/CartProvider";
import { MessageProvider } from "./providers/MessageProvider";
import { SectionProvider } from "./providers/SectionProvider";
import { SnackbarProvider } from "./providers/SnackbarProvider";

export default function ThemedApp({ isRTL }) {
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0c1f22",
        paper: "#0f2a2e",
      },
      primary: {
        main: "#d2b26b",
      },
      secondary: {
        main: "#b8903f",
      },
      text: {
        primary: "#e9f2f1",
        secondary: "#b8c9c6",
      },
    },
    shape: {
      borderRadius: 6,
    },
    typography: {
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
      button: {
        letterSpacing: "0.04em",
        fontWeight: 600,
        textTransform: "none",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <ProductProvider>
          <SectionProvider>
            <RequestProvider>
              <CartProvider>
                <MessageProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </MessageProvider>
              </CartProvider>
            </RequestProvider>
          </SectionProvider>
        </ProductProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
