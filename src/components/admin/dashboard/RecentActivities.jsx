import React from "react";
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Warning, TrendingUp, Notifications as NotificationIcon } from "@mui/icons-material";

const RecentActivities = ({ activities }) => (
  <Paper sx={{ p: 2.5 }}>
    <Typography variant="h6" fontWeight={600} mb={2}>🔔 Hoạt động gần đây</Typography>
    <List sx={{ p: 0 }}>
      {activities.map((a) => (
        <ListItem key={a.id} sx={{ px: 0, py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            {a.type === "warning" && <Warning color="warning" />}
            {a.type === "success" && <TrendingUp color="success" />}
            {a.type === "info" && <NotificationIcon color="info" />}
            {a.type === "error" && <Warning color="error" />}
          </ListItemIcon>
          <ListItemText primary={a.message} secondary={a.time}
            primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: 11 }} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default RecentActivities;
