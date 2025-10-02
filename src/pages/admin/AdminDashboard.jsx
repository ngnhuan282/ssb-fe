import React from "react";
import { Box, Toolbar, Grid } from "@mui/material";

import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import RunningBusTable from "../../components/admin/dashboard/RunningBusTable";
import RecentActivities from "../../components/admin/dashboard/RecentActivities";

import { statsData, runningBuses, recentActivities } from "../../data/mockAdminData";

const AdminDashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}>
      <AdminHeader />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: "auto" }}>
        <Grid container spacing={3} mb={4}>
          {statsData.map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <StatsCard stat={stat} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <RunningBusTable buses={runningBuses} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivities activities={recentActivities} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;