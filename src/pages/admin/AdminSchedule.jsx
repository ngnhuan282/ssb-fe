import React from "react";
import { Box, Toolbar, Grid } from "@mui/material";

import AdminHeader from "../../components/admin/layout/AdminHeader";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import ScheduleManager from "../../components/admin/schedule/ScheduleManager";

const AdminSchedule = () => {
    return (
        <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f6fa" }}>
            <AdminHeader />
            <AdminSidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflowY: "auto" }}>
                <ScheduleManager />
            </Box>
        </Box>
    );
};

export default AdminSchedule;