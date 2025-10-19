import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";

const DriverPage = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5 landen6fa" }}>
      <AdminHeader />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Quản lý Tài xế
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              Đây là trang quản lý tài xế. Chức năng sẽ được thêm sau.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DriverPage;