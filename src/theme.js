// theme.js
import { createTheme } from "@mui/material/styles";

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
    borderRadius: 18,
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    button: {
      letterSpacing: "0.04em",
      fontWeight: 600,
      textTransform: "none",
    },
  },
});

export default theme;
