import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
      }}
    >
      <AdminHeader />
      <AdminSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          p: 3, // Padding đều cho tất cả các page
          minHeight: "calc(100vh - 64px)",
          width: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;