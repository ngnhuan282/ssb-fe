// src/App.jsx
import React from "react";
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
      <Header />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "70px", // Header height
          p: 3, // Padding đều cho tất cả các page
          // minHeight: "calc(100vh - 70px)",
          // width: 0, // Flexbox trick
          overflowY: "auto", 
          overflowX: "hidden", 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default App;