import { useMemo } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import { ProductProvider } from "./providers/ProductProvider";
import { RequestProvider } from "./providers/RequestProvider";
import { CartProvider } from "./providers/CartProvider";
import { MessageProvider } from "./providers/MessageProvider";
import { SectionProvider } from "./providers/SectionProvider";
import { SnackbarProvider } from "./providers/SnackbarProvider";

export default function ThemedApp({ isRTL }) {
  const theme = useMemo(
    () =>
      createTheme({
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
          borderRadius: 10,
        },
        typography: {
          fontFamily:
            '"Literata", ui-serif, Georgia, "Times New Roman", serif, ui-sans-serif, system-ui, -apple-system, Roboto',
          button: {
            letterSpacing: "0.04em",
            fontWeight: 600,
            textTransform: "none",
          },
        },
        components: {
          MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                textTransform: "none",
                transition: "all 0.22s ease",
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    []
  );

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
