// src/App.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/user/layout/Header";
import Sidebar from "./components/user/layout/Sidebar";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Trạng thái mở/đóng sidebar

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f5f7fa",
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar onToggle={handleSidebarToggle} />

      {/* Main Content - Outlet */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "70px", // Khoảng cách cho Header
          ml: sidebarOpen ? "280px" : "80px", // Điều chỉnh margin-left dựa trên trạng thái sidebar
          transition: "margin 0.3s ease",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default App;