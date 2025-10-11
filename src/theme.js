import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#007bff" },
    error: { main: "#dc3545" },
    warning: { main: "#ffc107" },
    success: { main: "#28a745" },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
});

export default theme;
