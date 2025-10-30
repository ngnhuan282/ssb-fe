import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const StatsCard = ({ stat }) => (
  <Card sx={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`, color: "#fff", borderRadius: 3, width: "300px" }}>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box>{stat.icon}</Box>
        <Chip label={stat.change} size="small" icon={<TrendingUp sx={{ fontSize: 14 }} />}
          sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }} />
      </Box>
      <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
      <Typography variant="body2">{stat.title}</Typography>
    </CardContent>
  </Card>
);

export default StatsCard;
