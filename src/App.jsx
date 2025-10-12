// src/App.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/user/layout/Header";
import Sidebar from "./components/user/layout/Sidebar";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Outlet */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "70px", // Khoảng cách cho Header
          p: 3, // Padding cho content
          minHeight: "calc(100vh - 70px)",
          width: 0, // Trick để flexbox hoạt động đúng
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default App;