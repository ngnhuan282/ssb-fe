import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const DriverPage = () => {
  return (
    <Box sx={{ p: 3, overflowY: "auto" }}>
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
  );
};

export default DriverPage;