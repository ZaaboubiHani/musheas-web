import { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { useSiteSettings } from "./providers/SiteSettingsProvider";

import { ProductProvider } from "./providers/ProductProvider";
import { RequestProvider } from "./providers/RequestProvider";
import { CartProvider } from "./providers/CartProvider";

export default function ThemedApp({ isRTL }) {
  // const { settings, loading } = useSiteSettings();

  // const [mode, setMode] = useState("light");

  // const theme = useMemo(() => {
  //   if (!settings) return createTheme();

  //   const { theme: t } = settings;
  //   const isDark = mode === "dark";

  //   const colors = isDark && t.dark?.colors ? t.dark.colors : t.colors;
  //   const text = isDark && t.dark?.text ? t.dark.text : t.text;
  //   const background =
  //     isDark && t.dark?.background ? t.dark.background : t.background;

  //   const borderThickness = isDark
  //     ? t.dark?.borderThickness ?? t.borderThickness ?? 1
  //     : t.borderThickness ?? 1;

  //   return createTheme({
  //     direction: isRTL ? "rtl" : "ltr",

  //     palette: {
  //       mode,
  //       primary: { main: colors.primary },
  //       secondary: { main: colors.secondary },
  //       success: { main: colors.success },
  //       warning: { main: colors.warning },
  //       error: { main: colors.error },

  //       text: {
  //         primary: text.primary,
  //         secondary: text.secondary,
  //         disabled: text.disabled,
  //         hint: text.hint || text.secondary,
  //         accent: text.accent || text.primary,
  //       },

  //       background: {
  //         default: background.default,
  //         paper: background.paper,
  //       },

  //       divider: colors.border || "#e0e0e0", // global border color
  //     },

  //     shape: {
  //       borderRadius: t.borderRadius ?? 8,
  //     },

  //     typography: {
  //       fontFamily: t.font?.family,
  //       h1: { fontFamily: t.font?.heading },
  //       h2: { fontFamily: t.font?.heading },
  //       h3: { fontFamily: t.font?.heading },
  //       body1: { fontFamily: t.font?.body },
  //       body2: { fontFamily: t.font?.body },
  //     },

  //     components: {
  //       MuiButton: {
  //         styleOverrides: {
  //           root: {
  //             borderColor: colors.border || colors.secondary,
  //             borderWidth: borderThickness,
  //             borderStyle: "solid", // make sure the border shows
  //             color: text.primary, // text color
  //             backgroundColor: colors.secondary, // <-- set button background
  //             transition:
  //               "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
  //             "&:hover": {
  //               backgroundColor: colors.primaryDark || colors.primary, // optional hover color
  //               transform: "translateY(-2px) scale(1.05)",
  //             },
  //           },
  //         },
  //       },
  //       MuiIconButton: {
  //         styleOverrides: {
  //           root: {
  //             borderColor: colors.border || colors.secondary,
  //             borderWidth: borderThickness,
  //             borderStyle: "solid",
  //             color: text.primary, // icon color
  //             backgroundColor: colors.secondary, // button background
  //             transition:
  //               "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
  //             "&:hover": {
  //               backgroundColor: colors.primary, // hover color
  //               transform: "translateY(-2px) scale(1.05)",
  //             },
  //           },
  //         },
  //       },
  //       MuiSelect: {
  //         styleOverrides: {
  //           root: {
  //             "& .MuiOutlinedInput-notchedOutline": {
  //               borderColor: colors.border || colors.secondary,
  //               borderWidth: borderThickness,
  //             },
  //             "& .MuiSelect-select": {
  //               color: text.primary, // text color of selected value
  //             },
  //             "&:hover .MuiOutlinedInput-notchedOutline": {
  //               borderColor: colors.primaryDark || colors.primary, // hover border color
  //             },
  //           },
  //         },
  //       },

  //       MuiTextField: {
  //         styleOverrides: {
  //           root: {
  //             "& .MuiOutlinedInput-notchedOutline": {
  //               borderColor: colors.border || colors.secondary,
  //               borderWidth: borderThickness,
  //             },
  //             "& .MuiInputBase-input": {
  //               color: text.primary,
  //             },
  //           },
  //         },
  //       },
  //       MuiPaper: {
  //         styleOverrides: {
  //           root: {
  //             borderColor: colors.border || colors.secondary,
  //             borderWidth: borderThickness,
  //           },
  //         },
  //       },
  //       MuiCard: {
  //         styleOverrides: {
  //           root: {
  //             borderColor: colors.border || colors.secondary,
  //             borderWidth: borderThickness,
  //             borderStyle: "solid",
  //           },
  //         },
  //       },
  //       MuiDivider: {
  //         styleOverrides: {
  //           root: {
  //             backgroundColor: colors.border || "#e0e0e0",
  //           },
  //         },
  //       },
  //     },
  //   });
  // }, [settings, isRTL, mode]);

  // if (loading) return null;

  // document.documentElement.dir = isRTL ? "rtl" : "ltr";

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
      <ProductProvider>
        <RequestProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </RequestProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}
