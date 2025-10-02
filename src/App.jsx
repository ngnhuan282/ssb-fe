import React from "react";
import MapComponent from "./components/Map.jsx";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Tạo theme cho MUI
const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    error: {
      main: "#dc3545",
    },
    warning: {
      main: "#ffc107",
    },
    success: {
      main: "#28a745",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS của MUI */}
      <MapComponent />
    </ThemeProvider>
  );
}

export default App;
