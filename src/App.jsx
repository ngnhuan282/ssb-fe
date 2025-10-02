import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import MapPage from "./pages/user/MapPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/map" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
