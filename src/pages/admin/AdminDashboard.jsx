import React from "react";
import { Box, Grid } from "@mui/material";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import RunningBusTable from "../../components/admin/dashboard/RunningBusTable";
import RecentActivities from "../../components/admin/dashboard/RecentActivities";

import { statsData, runningBuses, recentActivities } from "../../data/mockAdminData";

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3, overflowY: "auto" }}>
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
  );
};

export default AdminDashboard;