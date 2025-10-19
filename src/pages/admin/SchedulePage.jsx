import React from "react";
import { Box } from "@mui/material";
import ScheduleManager from "../../components/admin/schedule/ScheduleManager";

const SchedulePage = () => {
  return (
    <Box sx={{ p: 3, overflowY: "auto" }}>
      <ScheduleManager />
    </Box>
  );
};

export default SchedulePage;